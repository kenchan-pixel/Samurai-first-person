export class View {
  constructor(c) {
    this.c = c;
    this.gl = c.getContext('webgl2', { antialias: false, powerPreference: 'high-performance' });
    if (!this.gl) throw Error('WebGL2 unavailable');

    const V = `#version 300 es
void main(){
  vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);
  gl_Position=vec4(p*2.-1.,0,1);
}`;

    const F = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 R;
uniform float T,phase,prog,adir,pact,pdir,hit,stage,shake;

float box(vec2 p,vec2 b){
  vec2 d=abs(p)-b;
  return length(max(d,0.))+min(max(d.x,d.y),0.);
}

float seg(vec2 p,vec2 a,vec2 b,float w){
  vec2 pa=p-a,ba=b-a;
  float h=clamp(dot(pa,ba)/max(dot(ba,ba),.0001),0.,1.);
  return length(pa-ba*h)-w;
}

vec2 rot(vec2 p,float a){
  float c=cos(a),s=sin(a);
  return mat2(c,-s,s,c)*p;
}

float rbox(vec2 p,vec2 b,float a){
  return box(rot(p,a),b);
}

float ease(float x){
  x=clamp(x,0.,1.);
  return x*x*(3.-2.*x);
}

float mask(float d,float feather){
  return 1.-smoothstep(0.,feather,d);
}

vec3 armourBase(float s){
  if(s<.5) return vec3(.34,.23,.13);
  if(s<1.5) return vec3(.11,.19,.30);
  if(s<2.5) return vec3(.28,.085,.055);
  return vec3(.25,.035,.04);
}

vec3 clothBase(float s){
  if(s<.5) return vec3(.18,.12,.075);
  if(s<1.5) return vec3(.11,.09,.12);
  if(s<2.5) return vec3(.10,.055,.045);
  return vec3(.34,.04,.055);
}

vec3 metalBase(float s){
  return s>2.5?vec3(.78,.55,.18):s>1.5?vec3(.55,.34,.12):vec3(.56,.58,.53);
}

vec3 paint(vec2 uv){
  float boss=step(2.5,stage);
  vec3 sky=mix(vec3(.055,.075,.095),vec3(.13,.035,.035),boss);
  vec3 c=mix(vec3(.012,.014,.018),sky,clamp(uv.y+.55,0.,1.));

  // Receding dojo architecture gives the opponent breathing room in portrait view.
  float horizon=-.19;
  float roof=box(uv-vec2(0.,.28),vec2(.55,.065));
  c=mix(c,mix(vec3(.055,.06,.065),vec3(.10,.035,.03),boss),mask(roof,.025));
  float roofLip=box(uv-vec2(0.,.205),vec2(.64,.022));
  c=mix(c,vec3(.025,.028,.03),mask(roofLip,.02));
  float gate=box(uv-vec2(0.,.04),vec2(.30,.24));
  c=mix(c,vec3(.07,.055,.045),mask(gate,.025)*.72);
  for(float s=-1.;s<=1.;s+=2.){
    float pillar=box(uv-vec2(s*.46,.00),vec2(.035,.30));
    c=mix(c,vec3(.25,.075,.045),mask(pillar,.018));
    float lantern=box(uv-vec2(s*.34,-.04),vec2(.038,.065));
    c=mix(c,vec3(.78,.43,.16),mask(lantern,.025)*(.5+.25*sin(T*2.+s)));
  }

  float floorY=uv.y-horizon;
  if(floorY<0.){
    float z=.13/max(.025,-floorY);
    float gx=abs(fract((uv.x/z+.5)*7.)-.5);
    float gy=abs(fract(z*3.2)-.5);
    float grid=(.035/(gx+.11)+.026/(gy+.10))*(1.-smoothstep(-.72,-.03,floorY));
    c+=mix(vec3(.16,.13,.09),vec3(.13,.075,.065),boss)*grid;
  }

  float hitGlow=exp(-max(0.,hit)*5.);
  float tele=phase>.5&&phase<1.5?ease(prog):0.;
  float strike=phase>1.5&&phase<2.5?ease(prog):0.;
  float recover=phase>2.5&&phase<3.5?ease(prog):0.;
  float a=adir*1.5707963;
  vec2 attackAxis=vec2(sin(a),cos(a));
  vec2 sideAxis=vec2(attackAxis.y,-attackAxis.x);
  float attackPulse=sin(strike*3.1415926);

  // Wider framing: enemy occupies roughly 62% of portrait height instead of almost the full view.
  float enemyScale=.72 + min(stage,3.)*.012;
  vec2 bodyShift=-attackAxis*.040*tele+attackAxis*.060*attackPulse;
  bodyShift+=sideAxis*.014*sin(T*2.0+stage*1.7)*(1.-min(1.,tele+strike));
  bodyShift.y-=max(0.,-attackAxis.y)*.035*tele;
  bodyShift+=vec2(hitGlow*.055,0.);
  vec2 e=(uv-bodyShift)/enemyScale;

  float torsoTilt=-attackAxis.x*.12*tele+attackAxis.x*.17*attackPulse;
  float shadow=length(vec2(e.x*.9,(e.y+.39)*3.0))-.19;
  c=mix(c,vec3(.008,.007,.007),mask(shadow,.08)*.72);

  vec3 armour=armourBase(stage);
  vec3 armourDark=armour*.38;
  vec3 armourLight=mix(armour,vec3(.78,.53,.25),.28);
  vec3 cloth=clothBase(stage);
  vec3 metal=metalBase(stage);

  // Legs / hakama / greaves.
  float hakamaL=rbox(e-vec2(-.075,-.20),vec2(.075,.15),-.09);
  float hakamaR=rbox(e-vec2(.075,-.20),vec2(.075,.15),.09);
  c=mix(c,cloth,mask(min(hakamaL,hakamaR),.018));
  float shinL=seg(e,vec2(-.085,-.28),vec2(-.13,-.40),.047);
  float shinR=seg(e,vec2(.085,-.28),vec2(.13,-.40),.047);
  c=mix(c,armourDark,mask(min(shinL,shinR),.017));
  float greaveL=box(rot(e-vec2(-.115,-.34),-.10),vec2(.055,.065));
  float greaveR=box(rot(e-vec2(.115,-.34),.10),vec2(.055,.065));
  c=mix(c,metal*.48,mask(min(greaveL,greaveR),.015));

  // Lamellar skirt plates create a stronger, recognisable samurai silhouette.
  for(float i=-2.;i<=2.;i+=1.){
    float plate=box(e-vec2(i*.052,-.105-abs(i)*.006),vec2(.032,.105));
    float plateMask=mask(plate,.014);
    vec3 plateCol=mix(armourDark,armour,.52+.09*i);
    c=mix(c,plateCol,plateMask);
  }

  // Torso and layered chest plates with faux directional lighting.
  vec2 chestLocal=rot(e-vec2(0.,.095),torsoTilt);
  float torso=rbox(e-vec2(0.,.09),vec2(.145,.19),torsoTilt);
  float torsoM=mask(torso,.02);
  float lightBand=clamp(.48+.55*(chestLocal.x*.9+chestLocal.y*.35),0.,1.);
  c=mix(c,mix(armourDark,armourLight,lightBand),torsoM);
  for(float y=0.;y<3.;y+=1.){
    float chestPlate=box(chestLocal-vec2(0.,.08-y*.055),vec2(.14,.012));
    c=mix(c,metal*.58,mask(chestPlate,.012)*.7);
  }

  // Shoulder armour broadens the read without making the body fill the screen.
  float shoulderL=rbox(e-vec2(-.17,.18),vec2(.082,.045),-.18-torsoTilt*.4);
  float shoulderR=rbox(e-vec2(.17,.18),vec2(.082,.045),.18-torsoTilt*.4);
  c=mix(c,mix(armourDark,armourLight,.45),mask(min(shoulderL,shoulderR),.018));

  // Waist sash and stage-specific cloth accents.
  float sash=box(rot(e-vec2(0.,-.015),torsoTilt),vec2(.16,.028));
  c=mix(c,cloth*.75,mask(sash,.015));
  if(stage>2.5){
    float cape=seg(e,vec2(.13,.10),vec2(.27,-.22),.105);
    c=mix(c,vec3(.24,.025,.04),mask(cape,.04)*.88);
  }

  // Head, menpo and helmet. Stage silhouettes differ without external assets.
  vec2 headPos=vec2(attackAxis.x*.014*tele,.355+attackAxis.y*.006*tele);
  float neck=box(e-headPos+vec2(0.,.105),vec2(.045,.055));
  c=mix(c,cloth*.72,mask(neck,.015));
  float face=length((e-headPos)*vec2(1.,1.08))-.082;
  c=mix(c,vec3(.34,.22,.15),mask(face,.018));
  float menpo=box(e-headPos+vec2(0.,.018),vec2(.07,.045));
  c=mix(c,stage>1.5?vec3(.11,.018,.018):vec3(.045,.042,.04),mask(menpo,.014));
  float eyeBand=box(e-headPos-vec2(0.,.018),vec2(.062,.008));
  c=mix(c,vec3(.82,.50,.20),mask(eyeBand,.008)*(.65+.18*tele));

  float helmCrown=box(e-headPos-vec2(0.,.072),vec2(.09,.055));
  c=mix(c,vec3(.04,.045,.05),mask(helmCrown,.018));
  float helmBrim=box(e-headPos-vec2(0.,.045),vec2(.145+.012*min(stage,2.),.018));
  c=mix(c,metal*.52,mask(helmBrim,.012));
  if(stage<.5){
    float jingasa=rbox(e-headPos-vec2(0.,.095),vec2(.17,.028),0.);
    c=mix(c,vec3(.13,.10,.065),mask(jingasa,.018));
  }else if(stage<1.5){
    float headband=seg(e,headPos+vec2(-.10,.045),headPos+vec2(.10,.045),.012);
    c=mix(c,vec3(.55,.12,.08),mask(headband,.01));
  }else{
    float hornL=seg(e,headPos+vec2(-.055,.105),headPos+vec2(-.115,.17),.014);
    float hornR=seg(e,headPos+vec2(.055,.105),headPos+vec2(.115,.17),.014);
    c=mix(c,metal,mask(min(hornL,hornR),.012));
  }
  if(stage>2.5){
    float crest=length(e-headPos-vec2(0.,.145))-.038;
    c=mix(c,vec3(.86,.58,.16),mask(crest,.012));
  }

  // Two-handed sword animation. Hands travel farther during anticipation for readability.
  float swordAngle=a-.38;
  if(phase>.5&&phase<1.5){
    swordAngle=mix(a-.38,a-1.08,tele);
  }else if(phase>1.5&&phase<2.5){
    float cut=ease(clamp(prog*1.16,0.,1.));
    swordAngle=mix(a-1.08,a+1.18,cut);
  }else if(phase>2.5&&phase<3.5){
    swordAngle=mix(a+1.18,a+.28,recover);
  }

  vec2 hilt=vec2(.105,.205)-attackAxis*.13*tele+attackAxis*.045*attackPulse+sideAxis*.035;
  vec2 shoulderA=vec2(.13,.19);
  vec2 shoulderB=vec2(-.13,.19);
  vec2 elbowA=hilt-sideAxis*.14-attackAxis*.055;
  vec2 elbowB=hilt+sideAxis*.09-attackAxis*.04;
  float armA=seg(e,shoulderA,elbowA,.035);
  float foreA=seg(e,elbowA,hilt,.032);
  float armB=seg(e,shoulderB,elbowB,.034);
  float foreB=seg(e,elbowB,hilt-attackAxis*.025,.030);
  c=mix(c,cloth*.82,mask(min(min(armA,foreA),min(armB,foreB)),.016));
  float glove=length(e-hilt)-.042;
  c=mix(c,vec3(.08,.055,.04),mask(glove,.012));

  vec2 bladeDir=vec2(sin(swordAngle),cos(swordAngle));
  float blade=seg(e,hilt-bladeDir*.045,hilt+bladeDir*.64,.014);
  float bladeHalo=seg(e,hilt-bladeDir*.045,hilt+bladeDir*.64,.044);
  float readPulse=tele*smoothstep(.35,1.,prog)*(.70+.30*sin(T*16.));
  vec3 teleCol=mix(vec3(1.,.48,.12),vec3(1.,.16,.12),boss);
  c+=teleCol*mask(bladeHalo,.06)*readPulse*.23;
  c=mix(c,vec3(.94,.96,.93),mask(blade,.014));
  float guard=seg(e,hilt-sideAxis*.058,hilt+sideAxis*.058,.012);
  c=mix(c,metal*.72,mask(guard,.010));

  // Directional anticipation arc sits behind the sword, not over the HUD.
  float arcR=length(e-(hilt+bladeDir*.25));
  float arc=abs(arcR-.29)-.014;
  float arcSide=dot(normalize(e-(hilt+bladeDir*.25)+vec2(.0001)),sideAxis);
  float arcM=mask(arc,.035)*smoothstep(-.2,.55,arcSide)*readPulse;
  c+=teleCol*arcM*.12;

  float trail=strike*sin(clamp(prog,0.,1.)*3.1415926);
  float trailAngle1=swordAngle-.16;
  float trailAngle2=swordAngle-.32;
  vec2 trailDir1=vec2(sin(trailAngle1),cos(trailAngle1));
  vec2 trailDir2=vec2(sin(trailAngle2),cos(trailAngle2));
  float trail1=seg(e,hilt+trailDir1*.02,hilt+trailDir1*.63,.025);
  float trail2=seg(e,hilt+trailDir2*.03,hilt+trailDir2*.59,.040);
  c+=teleCol*mask(trail1,.045)*trail*.34;
  c+=teleCol*.65*mask(trail2,.062)*trail*.17;

  float contact=hitGlow*exp(-18.*abs(length(e-vec2(.02,.05))-.23));
  c+=vec3(1.,.55,.18)*contact*.18;

  // Player katana stays in the near foreground while the opponent is framed farther back.
  float playerAngle=pdir*1.5708+(pact>.5?(pact>1.5?sin(T*16.)*.55:-.9+fract(T*3.)*1.8):-.6);
  vec2 playerHilt=uv-vec2(.37,-.50);
  vec2 playerDir=vec2(sin(playerAngle),cos(playerAngle));
  float playerBlade=seg(playerHilt,-playerDir*.08,playerDir*.67,.021);
  float playerGuard=seg(playerHilt,vec2(-.055,.0),vec2(.055,.0),.018);
  c=mix(c,vec3(.94,.96,.91),mask(playerBlade,.018));
  c=mix(c,vec3(.33,.21,.09),mask(playerGuard,.012));

  c+=vec3(1.,.45,.18)*hitGlow*.18;
  return c;
}

void main(){
  vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;
  uv+=vec2(sin(T*61.),cos(T*53.))*shake*.002;
  vec3 c=paint(uv);
  float vig=1.-smoothstep(.34,.92,length(uv));
  O=vec4(c*(.58+.42*vig),1);
}`;

    this.p = this.program(V, F);
    this.gl.useProgram(this.p);
    this.u = {};
    for (const n of ['R', 'T', 'phase', 'prog', 'adir', 'pact', 'pdir', 'hit', 'stage', 'shake']) {
      this.u[n] = this.gl.getUniformLocation(this.p, n);
    }
  }

  shader(t, s) {
    const x = this.gl.createShader(t);
    this.gl.shaderSource(x, s);
    this.gl.compileShader(x);
    if (!this.gl.getShaderParameter(x, this.gl.COMPILE_STATUS)) throw Error(this.gl.getShaderInfoLog(x));
    return x;
  }

  program(v, f) {
    const p = this.gl.createProgram();
    this.gl.attachShader(p, this.shader(this.gl.VERTEX_SHADER, v));
    this.gl.attachShader(p, this.shader(this.gl.FRAGMENT_SHADER, f));
    this.gl.linkProgram(p);
    if (!this.gl.getProgramParameter(p, this.gl.LINK_STATUS)) throw Error(this.gl.getProgramInfoLog(p));
    return p;
  }

  draw(s, n, m = {}) {
    const d = Math.min(devicePixelRatio || 1, 1.6);
    const w = Math.floor(this.c.clientWidth * d);
    const h = Math.floor(this.c.clientHeight * d);
    if (this.c.width !== w || this.c.height !== h) {
      this.c.width = w;
      this.c.height = h;
      this.gl.viewport(0, 0, w, h);
    }
    const map = { telegraph: 1, strike: 2, recovery: 3 };
    this.gl.useProgram(this.p);
    this.gl.uniform2f(this.u.R, w, h);
    this.gl.uniform1f(this.u.T, n / 1000);
    this.gl.uniform1f(this.u.phase, map[s.phase] || 0);
    this.gl.uniform1f(this.u.prog, s.phaseProgress);
    this.gl.uniform1f(this.u.adir, m.attackDirectionIndex || 0);
    this.gl.uniform1f(this.u.pact, m.playerAction || 0);
    this.gl.uniform1f(this.u.pdir, m.playerDirectionIndex || 0);
    this.gl.uniform1f(this.u.hit, m.hitAge ?? 999);
    this.gl.uniform1f(this.u.stage, s.enemyIndex || 0);
    this.gl.uniform1f(this.u.shake, m.shake || 0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}
