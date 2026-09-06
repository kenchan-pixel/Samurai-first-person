import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const defaultOut = resolve(here, '../public/assets/samurai-v1.glb');
const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const cliOutPath = isCli && process.argv[2] ? resolve(process.argv[2]) : defaultOut;
const rad = (d) => d * Math.PI / 180;
const quat = (xd = 0, yd = 0, zd = 0) => {
  const [x, y, z] = [rad(xd), rad(yd), rad(zd)];
  const [cx, sx, cy, sy, cz, sz] = [Math.cos(x / 2), Math.sin(x / 2), Math.cos(y / 2), Math.sin(y / 2), Math.cos(z / 2), Math.sin(z / 2)];
  return [sx * cy * cz + cx * sy * sz, cx * sy * cz - sx * cy * sz, cx * cy * sz + sx * sy * cz, cx * cy * cz - sx * sy * sz];
};

const chunks = [];
let byteLength = 0;
const views = [];
const accessors = [];
const align4 = () => { const pad = (4 - (byteLength % 4)) % 4; if (pad) { chunks.push(Buffer.alloc(pad)); byteLength += pad; } };
const addView = (data, target) => {
  align4();
  const off = byteLength;
  chunks.push(data); byteLength += data.length; align4();
  const view = { buffer: 0, byteOffset: off, byteLength: data.length };
  if (target) view.target = target;
  views.push(view);
  return views.length - 1;
};
const pack = (componentType, data) => {
  const bytes = componentType === 5126 ? 4 : componentType === 5123 ? 2 : 1;
  const b = Buffer.alloc(data.length * bytes);
  data.forEach((v, i) => {
    if (componentType === 5126) b.writeFloatLE(v, i * 4);
    else if (componentType === 5123) b.writeUInt16LE(v, i * 2);
    else b.writeUInt8(v, i);
  });
  return b;
};
const addAccessor = (data, componentType, type, count, target, min, max) => {
  const a = { bufferView: addView(pack(componentType, data), target), componentType, count, type };
  if (min) a.min = min;
  if (max) a.max = max;
  accessors.push(a);
  return accessors.length - 1;
};

const materials = [];
const addMat = (name, rgba, metallic = 0, roughness = 0.65, emissive = null) => {
  const m = { name, pbrMetallicRoughness: { baseColorFactor: rgba, metallicFactor: metallic, roughnessFactor: roughness } };
  if (emissive) m.emissiveFactor = emissive;
  materials.push(m); return materials.length - 1;
};
const MAT = {
  Cloth: addMat('Cloth', [0.13, 0.055, 0.025, 1], 0, 0.86),
  Armor: addMat('Armor', [0.34, 0.10, 0.035, 1], 0.48, 0.42),
  DarkArmor: addMat('DarkArmor', [0.045, 0.035, 0.032, 1], 0.56, 0.40),
  Metal: addMat('Metal', [0.45, 0.43, 0.38, 1], 0.92, 0.25),
  Skin: addMat('Skin', [0.36, 0.20, 0.13, 1], 0, 0.72),
  Blade: addMat('Blade', [0.72, 0.78, 0.80, 1], 0.98, 0.16, [0.025, 0.035, 0.04]),
  Accent: addMat('Accent', [0.72, 0.15, 0.035, 1], 0.32, 0.42),
  Cord: addMat('Cord', [0.24, 0.035, 0.02, 1], 0, 0.76),
};

const jointSpecs = [
  ['Root', null, [0, 0, 0]], ['Hips', 'Root', [0, 0.92, 0]], ['Spine', 'Hips', [0, 0.38, 0]], ['Chest', 'Spine', [0, 0.42, 0]],
  ['Neck', 'Chest', [0, 0.53, 0]], ['Head', 'Neck', [0, 0.22, 0]],
  ['UpperArmL', 'Chest', [-0.43, 0.26, 0]], ['ForearmL', 'UpperArmL', [0, -0.37, 0]], ['HandL', 'ForearmL', [0, -0.34, 0]],
  ['UpperArmR', 'Chest', [0.43, 0.26, 0]], ['ForearmR', 'UpperArmR', [0, -0.37, 0]], ['HandR', 'ForearmR', [0, -0.34, 0]], ['Sword', 'HandR', [0, -0.10, 0]],
  ['ThighL', 'Hips', [-0.18, -0.20, 0]], ['ShinL', 'ThighL', [0, -0.44, 0]], ['FootL', 'ShinL', [0, -0.36, 0.10]],
  ['ThighR', 'Hips', [0.18, -0.20, 0]], ['ShinR', 'ThighR', [0, -0.44, 0]], ['FootR', 'ShinR', [0, -0.36, 0.10]],
];
const jointIndex = Object.fromEntries(jointSpecs.map(([n], i) => [n, i]));
const bind = {};
for (const [name, parent, t] of jointSpecs) {
  const p = parent ? bind[parent] : [0, 0, 0];
  bind[name] = [p[0] + t[0], p[1] + t[1], p[2] + t[2]];
}

const geom = Array.from({ length: materials.length }, () => ({ p: [], n: [], j: [], w: [], i: [] }));
const tri = (mi, verts, norms, joint) => {
  const g = geom[mi]; const base = g.p.length / 3;
  verts.forEach((v, k) => { g.p.push(...v); g.n.push(...norms[k]); g.j.push(joint, 0, 0, 0); g.w.push(1, 0, 0, 0); });
  g.i.push(base, base + 1, base + 2);
};
const tp = ([x, y, z], c, rz = 0) => { const a = rad(rz), co = Math.cos(a), si = Math.sin(a); return [c[0] + co * x - si * y, c[1] + si * x + co * y, c[2] + z]; };
const tn = ([x, y, z], rz = 0) => { const a = rad(rz), co = Math.cos(a), si = Math.sin(a); return [co * x - si * y, si * x + co * y, z]; };
const box = (mi, joint, center, size, rz = 0, taper = 0) => {
  const [sx, sy, sz] = size.map((v) => v / 2); const top = Math.max(0.25, 1 - taper); const corners = [];
  for (const [yy, f] of [[-sy, 1], [sy, top]]) for (const zz of [-sz * f, sz * f]) for (const xx of [-sx * f, sx * f]) corners.push(tp([xx, yy, zz], center, rz));
  for (const [q, normal] of [[[0,1,3,2],[0,-1,0]], [[4,6,7,5],[0,1,0]], [[0,4,5,1],[0,0,-1]], [[2,3,7,6],[0,0,1]], [[0,2,6,4],[-1,0,0]], [[1,5,7,3],[1,0,0]]]) {
    const [a,b,c,d]=q, n=tn(normal,rz); tri(mi,[corners[a],corners[b],corners[c]],[n,n,n],joint); tri(mi,[corners[a],corners[c],corners[d]],[n,n,n],joint);
  }
};
const cyl = (mi, joint, center, radius, height, segments = 12, rz = 0) => {
  const y0=-height/2, y1=height/2;
  for (let k=0;k<segments;k++) {
    const a=2*Math.PI*k/segments,b=2*Math.PI*(k+1)/segments;
    const pa=[radius*Math.cos(a),y0,radius*Math.sin(a)], pb=[radius*Math.cos(b),y0,radius*Math.sin(b)], pc=[radius*Math.cos(b),y1,radius*Math.sin(b)], pd=[radius*Math.cos(a),y1,radius*Math.sin(a)];
    const na=tn([Math.cos(a),0,Math.sin(a)],rz), nb=tn([Math.cos(b),0,Math.sin(b)],rz);
    tri(mi,[tp(pa,center,rz),tp(pb,center,rz),tp(pc,center,rz)],[na,nb,nb],joint); tri(mi,[tp(pa,center,rz),tp(pc,center,rz),tp(pd,center,rz)],[na,nb,na],joint);
    const nt=tn([0,1,0],rz), nd=tn([0,-1,0],rz); tri(mi,[tp([0,y1,0],center,rz),tp(pd,center,rz),tp(pc,center,rz)],[nt,nt,nt],joint); tri(mi,[tp([0,y0,0],center,rz),tp(pb,center,rz),tp(pa,center,rz)],[nd,nd,nd],joint);
  }
};
const sphere = (mi, joint, center, radius, lat=8, lon=12, scale=[1,1,1]) => {
  const point=(v,u)=>{const n=[Math.cos(v)*Math.cos(u),Math.sin(v),Math.cos(v)*Math.sin(u)];return [[center[0]+radius*n[0]*scale[0],center[1]+radius*n[1]*scale[1],center[2]+radius*n[2]*scale[2]],n]};
  for(let i=0;i<lat;i++){const v0=-Math.PI/2+Math.PI*i/lat,v1=-Math.PI/2+Math.PI*(i+1)/lat;for(let k=0;k<lon;k++){const u0=2*Math.PI*k/lon,u1=2*Math.PI*(k+1)/lon;const [p00,n00]=point(v0,u0),[p01,n01]=point(v0,u1),[p11,n11]=point(v1,u1),[p10,n10]=point(v1,u0);tri(mi,[p00,p01,p11],[n00,n01,n11],joint);tri(mi,[p00,p11,p10],[n00,n11,n10],joint)}}
};
const C=(j,o)=>[bind[j][0]+o[0],bind[j][1]+o[1],bind[j][2]+o[2]];

box(MAT.Cloth,jointIndex.ThighL,C('ThighL',[0,-.12,0]),[.31,.52,.38],-5,.18); box(MAT.Cloth,jointIndex.ThighR,C('ThighR',[0,-.12,0]),[.31,.52,.38],5,.18);
cyl(MAT.DarkArmor,jointIndex.ShinL,C('ShinL',[0,-.12,0]),.105,.43,12,-3); cyl(MAT.DarkArmor,jointIndex.ShinR,C('ShinR',[0,-.12,0]),.105,.43,12,3);
for(const j of ['ShinL','ShinR']) for(const y of [-.04,-.14,-.24]) box(MAT.Metal,jointIndex[j],C(j,[0,y,-.105]),[.24,.035,.035]);
box(MAT.DarkArmor,jointIndex.FootL,C('FootL',[0,-.10,.13]),[.28,.13,.52],0,.1); box(MAT.DarkArmor,jointIndex.FootR,C('FootR',[0,-.10,.13]),[.28,.13,.52],0,.1);
box(MAT.Armor,jointIndex.Chest,C('Chest',[0,-.05,0]),[.78,.72,.40],0,.12);
for(let i=0;i<5;i++){box(MAT.DarkArmor,jointIndex.Chest,C('Chest',[0,.24-i*.13,-.225]),[.82-i*.025,.072,.065],0,.03);box(MAT.Metal,jointIndex.Chest,C('Chest',[0,.24-i*.13,-.262]),[.78-i*.025,.018,.018]);}
for(const [x,z] of [[-.34,-6],[0,0],[.34,6]]){box(MAT.Armor,jointIndex.Spine,C('Spine',[x,-.25,.02]),[.28,.52,.32],z,.22);box(MAT.Cord,jointIndex.Spine,C('Spine',[x,-.02,-.18]),[.23,.025,.025],z);}
for(const [side,j] of [[-1,'UpperArmL'],[1,'UpperArmR']]){for(let k=0;k<3;k++) box(MAT.Armor,jointIndex[j],C(j,[side*.055,.07-k*.09,0]),[.38-k*.035,.10,.50],side*(12+k*3),.12);cyl(MAT.Cloth,jointIndex[j],C(j,[0,-.13,0]),.115,.38,12,side*4);}
for(const j of ['ForearmL','ForearmR']){cyl(MAT.DarkArmor,jointIndex[j],C(j,[0,-.13,0]),.105,.34,12);for(const y of [-.03,-.13,-.23])box(MAT.Metal,jointIndex[j],C(j,[0,y,-.10]),[.20,.025,.025]);}
sphere(MAT.Skin,jointIndex.HandL,C('HandL',[0,-.04,0]),.12,6,10,[.9,.9,.9]);sphere(MAT.Skin,jointIndex.HandR,C('HandR',[0,-.04,0]),.12,6,10,[.9,.9,.9]);
cyl(MAT.Cloth,jointIndex.Neck,C('Neck',[0,.04,0]),.09,.14,10);sphere(MAT.Skin,jointIndex.Head,C('Head',[0,.08,0]),.22,10,16,[.9,1.02,.9]);
box(MAT.DarkArmor,jointIndex.Head,C('Head',[0,.03,.205]),[.37,.18,.055],0,.10);box(MAT.Accent,jointIndex.Head,C('Head',[0,.12,.225]),[.30,.025,.035]);
sphere(MAT.DarkArmor,jointIndex.Head,C('Head',[0,.29,0]),.25,8,16,[1.02,.65,1]);cyl(MAT.Metal,jointIndex.Head,C('Head',[0,.27,0]),.32,.045,20);
for(let k=0;k<3;k++)box(MAT.Armor,jointIndex.Head,C('Head',[0,.18-k*.055,-.19-k*.015]),[.46-k*.035,.05,.10],0,.08);
box(MAT.Accent,jointIndex.Head,C('Head',[-.15,.48,0]),[.075,.38,.075],-28,.45);box(MAT.Accent,jointIndex.Head,C('Head',[.15,.48,0]),[.075,.38,.075],28,.45);
cyl(MAT.DarkArmor,jointIndex.Sword,C('Sword',[0,.20,0]),.055,.42,12);for(const y of [.06,.14,.22,.30,.38])box(MAT.Cord,jointIndex.Sword,C('Sword',[0,y,.052]),[.12,.025,.025],Math.round(y*100)%2?20:-20);
cyl(MAT.Metal,jointIndex.Sword,C('Sword',[0,.45,0]),.18,.035,16);box(MAT.Blade,jointIndex.Sword,C('Sword',[0,1.12,0]),[.085,1.34,.028],0,.18);box(MAT.Metal,jointIndex.Sword,C('Sword',[-.038,1.10,0]),[.012,1.27,.035]);

const primitives=[];
for(let mi=0;mi<geom.length;mi++){
  const g=geom[mi]; if(!g.i.length)continue; const xs=g.p.filter((_,i)=>i%3===0),ys=g.p.filter((_,i)=>i%3===1),zs=g.p.filter((_,i)=>i%3===2);
  const pa=addAccessor(g.p,5126,'VEC3',g.p.length/3,34962,[Math.min(...xs),Math.min(...ys),Math.min(...zs)],[Math.max(...xs),Math.max(...ys),Math.max(...zs)]);
  const na=addAccessor(g.n,5126,'VEC3',g.n.length/3,34962); const ja=addAccessor(g.j,5123,'VEC4',g.j.length/4,34962); const wa=addAccessor(g.w,5126,'VEC4',g.w.length/4,34962); const ia=addAccessor(g.i,5123,'SCALAR',g.i.length,34963,[Math.min(...g.i)],[Math.max(...g.i)]);
  primitives.push({attributes:{POSITION:pa,NORMAL:na,JOINTS_0:ja,WEIGHTS_0:wa},indices:ia,material:mi});
}

const nodes=jointSpecs.map(([name,,translation])=>({name,translation:[...translation]}));
for(let i=0;i<jointSpecs.length;i++){const children=[];for(let j=0;j<jointSpecs.length;j++)if(jointSpecs[j][1]===jointSpecs[i][0])children.push(j);if(children.length)nodes[i].children=children;}
const meshNode=nodes.length;nodes.push({name:'SamuraiMesh',mesh:0,skin:0});nodes[jointIndex.Root].children.push(meshNode);
const ibm=[];for(const [name] of jointSpecs){const [x,y,z]=bind[name];ibm.push(1,0,0,0,0,1,0,0,0,0,1,0,-x,-y,-z,1);}const ibmAccessor=addAccessor(ibm,5126,'MAT4',jointSpecs.length);

const animations=[];
const addAnim=(name,specs)=>{const samplers=[],channels=[];for(const [joint,path,kfs] of specs){const times=kfs.map(([t])=>t),vals=kfs.flatMap(([,v])=>v);const ti=addAccessor(times,5126,'SCALAR',times.length,undefined,[Math.min(...times)],[Math.max(...times)]),vi=addAccessor(vals,5126,path==='rotation'?'VEC4':'VEC3',kfs.length);const sampler=samplers.length;samplers.push({input:ti,output:vi,interpolation:'LINEAR'});channels.push({sampler,target:{node:jointIndex[joint],path}});}animations.push({name,samplers,channels});};
addAnim('Idle', [['Hips','translation',[[0,[0,.92,0]],[.8,[0,.935,0]],[1.6,[0,.92,0]]]],['Chest','rotation',[[0,quat(-1,0,0)],[.8,quat(1.5,1,0)],[1.6,quat(-1,0,0)]]],['Head','rotation',[[0,quat(0,-2,0)],[.8,quat(0,2,0)],[1.6,quat(0,-2,0)]]],['UpperArmR','rotation',[[0,quat(-22,0,-18)],[.8,quat(-24,1,-17)],[1.6,quat(-22,0,-18)]]],['UpperArmL','rotation',[[0,quat(-18,0,18)],[.8,quat(-20,-1,17)],[1.6,quat(-18,0,18)]]],['Sword','rotation',[[0,quat(0,0,-18)],[.8,quat(0,0,-15)],[1.6,quat(0,0,-18)]]]]);
addAnim('Windup', [['Hips','translation',[[0,[0,.92,0]],[.62,[0,.91,.07]]]],['Chest','rotation',[[0,quat()],[.62,quat(-12,-10,-5)]]],['UpperArmR','rotation',[[0,quat(-22,0,-18)],[.62,quat(-112,-5,-28)]]],['ForearmR','rotation',[[0,quat(-20,0,6)],[.62,quat(-72,0,18)]]],['UpperArmL','rotation',[[0,quat(-18,0,18)],[.62,quat(-100,8,28)]]],['ForearmL','rotation',[[0,quat(-18,0,-5)],[.62,quat(-68,0,-16)]]],['Sword','rotation',[[0,quat(0,0,-18)],[.62,quat(0,0,-94)]]],['Head','rotation',[[0,quat()],[.62,quat(4,8,2)]]]]);
addAnim('Strike', [['Hips','translation',[[0,[0,.91,.07]],[.22,[0,.94,-.16]],[.44,[0,.92,-.08]]]],['Chest','rotation',[[0,quat(-12,-10,-5)],[.22,quat(14,18,7)],[.44,quat(9,14,9)]]],['UpperArmR','rotation',[[0,quat(-112,-5,-28)],[.22,quat(-20,18,36)],[.44,quat(18,12,54)]]],['ForearmR','rotation',[[0,quat(-72,0,18)],[.22,quat(-18,0,8)],[.44,quat(-8,0,2)]]],['UpperArmL','rotation',[[0,quat(-100,8,28)],[.22,quat(-30,-8,-30)],[.44,quat(6,-12,-48)]]],['ForearmL','rotation',[[0,quat(-68,0,-16)],[.22,quat(-22,0,-7)],[.44,quat(-8,0,1)]]],['Sword','rotation',[[0,quat(0,0,-94)],[.22,quat(0,0,8)],[.44,quat(0,0,78)]]],['Head','rotation',[[0,quat(4,8,2)],[.22,quat(-3,-8,-2)],[.44,quat(-2,-5,-3)]]]]);
addAnim('Recovery', [['Hips','translation',[[0,[0,.92,-.08]],[.72,[0,.92,0]]]],['Chest','rotation',[[0,quat(9,14,9)],[.38,quat(3,5,3)],[.72,quat()]]],['UpperArmR','rotation',[[0,quat(18,12,54)],[.38,quat(-8,5,14)],[.72,quat(-22,0,-18)]]],['ForearmR','rotation',[[0,quat(-8,0,2)],[.72,quat(-20,0,6)]]],['UpperArmL','rotation',[[0,quat(6,-12,-48)],[.38,quat(-10,-5,-12)],[.72,quat(-18,0,18)]]],['ForearmL','rotation',[[0,quat(-8,0,1)],[.72,quat(-18,0,-5)]]],['Sword','rotation',[[0,quat(0,0,78)],[.38,quat(0,0,20)],[.72,quat(0,0,-18)]]],['Head','rotation',[[0,quat(-2,-5,-3)],[.72,quat()]]]]);
addAnim('Parry', [['Hips','translation',[[0,[0,.92,-.04]],[.12,[0,.90,.10]],[.38,[0,.92,.02]]]],['Chest','rotation',[[0,quat(7,10,6)],[.12,quat(-13,-8,-10)],[.38,quat(-4,-2,-3)]]],['UpperArmR','rotation',[[0,quat(-20,10,30)],[.12,quat(-65,-4,-12)],[.38,quat(-42,0,-8)]]],['ForearmR','rotation',[[0,quat(-12,0,3)],[.12,quat(-48,0,16)],[.38,quat(-28,0,8)]]],['UpperArmL','rotation',[[0,quat(-24,-8,-28)],[.12,quat(-60,4,18)],[.38,quat(-38,0,12)]]],['ForearmL','rotation',[[0,quat(-14,0,-2)],[.12,quat(-44,0,-12)],[.38,quat(-26,0,-6)]]],['Sword','rotation',[[0,quat(0,0,30)],[.12,quat(0,0,-40)],[.38,quat(0,0,-12)]]],['Head','rotation',[[0,quat(-2,-4,-2)],[.12,quat(7,7,4)],[.38,quat(2,2,1)]]]]);

align4(); const bin = Buffer.concat(chunks); const gltf={asset:{version:'2.0',generator:'Samurai-first-person original GLB generator v1',copyright:'Original project asset; see docs/ASSET_PROVENANCE.md'},scene:0,scenes:[{name:'SamuraiScene',nodes:[jointIndex.Root]}],nodes,meshes:[{name:'SamuraiSkinnedMesh',primitives}],skins:[{name:'SamuraiRig',joints:jointSpecs.map((_,i)=>i),skeleton:jointIndex.Root,inverseBindMatrices:ibmAccessor}],animations,materials,buffers:[{byteLength:bin.length}],bufferViews:views,accessors};
let json=Buffer.from(JSON.stringify(gltf)); while(json.length%4)json=Buffer.concat([json,Buffer.from(' ')]); const total=12+8+json.length+8+bin.length; const header=Buffer.alloc(12);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(total,8);const jh=Buffer.alloc(8);jh.writeUInt32LE(json.length,0);jh.writeUInt32LE(0x4e4f534a,4);const bh=Buffer.alloc(8);bh.writeUInt32LE(bin.length,0);bh.writeUInt32LE(0x004e4942,4);const glb=Buffer.concat([header,jh,json,bh,bin]);
if(glb.readUInt32LE(0)!==0x46546c67||glb.readUInt32LE(4)!==2||glb.readUInt32LE(8)!==glb.length)throw new Error('GLB self-validation failed');
export function generateSamuraiGlb(outPath = defaultOut) {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, glb);
  return { path: outPath, bytes: glb.length, triangles: geom.reduce((n, g) => n + g.i.length / 3, 0), clips: animations.map((a) => a.name) };
}

if (isCli) {
  const info = generateSamuraiGlb(cliOutPath);
  console.log(`generated ${info.path} (${info.bytes} bytes, ${info.triangles} triangles, ${info.clips.length} clips)`);
}
