import { CombatEngine, Direction, directionFromSwipe, directionFromTap } from './game-core.js';

const $ = (selector) => document.querySelector(selector);
const canvas = $('#game-canvas');
const start = $('#start-screen');
const result = $('#result-screen');
const unsupported = $('#unsupported');

const U = {
  ph: $('#player-health'),
  eh: $('#enemy-health'),
  stage: $('#stage-label'),
  enemy: $('#enemy-name'),
  arena: $('#arena-name'),
  combo: $('#combo'),
  score: $('#score'),
  phase: $('#phase-label'),
  title: $('#prompt-title'),
  sub: $('#prompt-subtitle'),
  ind: $('#direction-indicator'),
  arrow: $('.direction-indicator__arrow'),
  dir: $('#direction-name'),
  flash: $('#impact-flash'),
  re: $('#result-eyebrow'),
  rt: $('#result-title'),
  rs: $('#result-summary'),
  rscore: $('#result-score'),
};

const zones = [...document.querySelectorAll('.zone')];
const engine = new CombatEngine();
const D = {
  [Direction.TOP]: ['↑', '上段', 0],
  [Direction.RIGHT]: ['→', '右方', 1],
  [Direction.BOTTOM]: ['↓', '下段', 2],
  [Direction.LEFT]: ['←', '左方', 3],
};
const P = {
  ready: ['待命', 'READ THE BLADE', '觀察敵人起手方向'],
  'stage-intro': ['敵人進場', 'DUEL BEGINS', '保持冷靜，先讀取動作'],
  gap: ['觀察', 'READ THE BLADE', '等待敵人起手'],
  telegraph: ['攻擊預備', 'TRACK THE BLADE', '留意最後方向'],
  strike: ['格擋時機', 'PARRY NOW', '點擊相應畫面邊緣'],
  recovery: ['反擊窗口', 'COUNTER', '掃屏斬擊敵人空隙'],
  'stage-clear': ['敵人倒下', 'STAGE CLEAR', '下一場決鬥準備中'],
  victory: ['試煉完成', 'VICTORY', '所有敵人已被擊敗'],
  defeat: ['倒下', 'DEFEAT', '重新調整呼吸再挑戰'],
};

let run = false;
let ptr = null;
let last = performance.now();
let pause = 0;
let msg = null;
let msgUntil = 0;
let action = 0;
let actionDir = 1;
let actionAt = 0;
let hitAt = -1e9;
let shake = 0;

class AudioFX {
  async on() {
    if (!this.c) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      this.c = new AudioContextClass();
      this.g = this.c.createGain();
      this.g.gain.value = 0.45;
      this.g.connect(this.c.destination);
    }
    if (this.c.state === 'suspended') await this.c.resume();
  }

  tone(a, b, d = 0.15, g = 0.07, t = 'triangle') {
    if (!this.c) return;
    const n = this.c.currentTime;
    const o = this.c.createOscillator();
    const e = this.c.createGain();
    o.type = t;
    o.frequency.setValueAtTime(a, n);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, b), n + d);
    e.gain.setValueAtTime(0.0001, n);
    e.gain.exponentialRampToValueAtTime(g, n + 0.01);
    e.gain.exponentialRampToValueAtTime(0.0001, n + d);
    o.connect(e).connect(this.g);
    o.start();
    o.stop(n + d + 0.02);
  }

  cue(k) {
    if (k === 'telegraph') this.tone(100, 150, 0.18, 0.03, 'sine');
    if (k === 'strike') this.tone(350, 90, 0.09, 0.04, 'sawtooth');
    if (k === 'parry') this.tone(1300, 700, 0.17, 0.09, 'square');
    if (k === 'perfect') this.tone(1850, 850, 0.23, 0.11, 'square');
    if (k === 'slash') this.tone(700, 170, 0.16, 0.06, 'sawtooth');
    if (k === 'hit') this.tone(95, 40, 0.25, 0.12, 'sawtooth');
    if (k === 'enemy') this.tone(210, 90, 0.16, 0.08);
    if (k === 'stage') this.tone(220, 440, 0.38, 0.06, 'sine');
    if (k === 'victory') this.tone(330, 660, 0.55, 0.08, 'sine');
  }
}

const audio = new AudioFX();

class View {
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

vec3 paint(vec2 uv){
  vec3 c=mix(vec3(.018,.02,.026),stage>1.5?vec3(.09,.025,.018):vec3(.035,.04,.05),max(0.,uv.y));
  float floorY=uv.y+.28;
  if(floorY<0.){
    float z=.12/max(.02,-floorY);
    float gx=abs(fract((uv.x/z+.5)*8.)-.5);
    float gy=abs(fract(z*3.)-.5);
    c+=vec3(.18,.13,.09)*(.05/(gx+.08)+.035/(gy+.08))*smoothstep(-.02,-.7,floorY);
  }

  for(float s=-1.;s<=1.;s+=2.){
    float d=box(uv-vec2(s*.72,.05),vec2(.04,.58));
    c=mix(c,vec3(.33,.12,.08),smoothstep(.025,0.,d));
    d=box(uv-vec2(s*.72,.55),vec2(.3,.045));
    c=mix(c,vec3(.42,.16,.1),smoothstep(.025,0.,d));
  }

  float hitGlow=exp(-max(0.,hit)*5.);
  float tele=phase>.5&&phase<1.5?ease(prog):0.;
  float strike=phase>1.5&&phase<2.5?ease(prog):0.;
  float recover=phase>2.5&&phase<3.5?ease(prog):0.;
  float a=adir*1.5707963;
  vec2 attackAxis=vec2(sin(a),cos(a));
  vec2 sideAxis=vec2(attackAxis.y,-attackAxis.x);

  float attackPulse=sin(strike*3.1415926);
  float stageWeight=1.+stage*.08;
  vec2 bodyShift=-attackAxis*.045*tele+attackAxis*.065*attackPulse;
  bodyShift+=sideAxis*.018*sin(T*2.1+stage*1.7)*(1.-min(1.,tele+strike));
  bodyShift.y-=max(0.,-attackAxis.y)*.045*tele;
  bodyShift.y+=max(0.,attackAxis.y)*.025*tele;
  bodyShift+=vec2(hitGlow*.08,0.);

  vec2 e=uv-bodyShift;
  float torsoTilt=-attackAxis.x*.11*tele+attackAxis.x*.16*attackPulse;
  float shadow=length(vec2(e.x*.95,(e.y+.39)*3.2))-.19*stageWeight;
  c=mix(c,vec3(.01,.008,.008),smoothstep(.08,0.,shadow)*.7);

  vec3 armour=stage<.5?vec3(.55,.16,.1):stage<1.5?vec3(.13,.22,.5):vec3(.45,.08,.07);
  vec3 armourDark=armour*.45;

  float leftLeg=seg(e,vec2(-.07,-.23),vec2(-.13-.02*stage,-.39),.052);
  float rightLeg=seg(e,vec2(.07,-.23),vec2(.13+.02*stage,-.39),.052);
  c=mix(c,armourDark,smoothstep(.02,0.,min(leftLeg,rightLeg)));

  float torso=rbox(e-vec2(0.,-.005),vec2(.165,.305),torsoTilt);
  c=mix(c,armour,smoothstep(.025,0.,torso));
  float sash=box(rot(e-vec2(0.,-.08),torsoTilt),vec2(.18,.035));
  c=mix(c,armourDark*.72,smoothstep(.018,0.,sash));

  vec2 headPos=vec2(attackAxis.x*.018*tele,.405+attackAxis.y*.008*tele);
  float head=length(e-headPos)-.105;
  c=mix(c,vec3(.58,.39,.25),smoothstep(.02,0.,head));
  float helm=box(e-headPos-vec2(0,.07),vec2(.15+.015*stage,.045));
  c=mix(c,vec3(.05),smoothstep(.02,0.,helm));

  float swordAngle=a-.38;
  if(phase>.5&&phase<1.5){
    swordAngle=mix(a-.38,a-.98,tele);
  }else if(phase>1.5&&phase<2.5){
    float cut=ease(clamp(prog*1.18,0.,1.));
    swordAngle=mix(a-.98,a+1.13,cut);
  }else if(phase>2.5&&phase<3.5){
    swordAngle=mix(a+1.13,a+.28,recover);
  }

  vec2 hilt=vec2(.11,.19)-attackAxis*.11*tele+attackAxis*.035*attackPulse+sideAxis*.035;
  vec2 shoulderL=vec2(-.105,.19);
  vec2 shoulderR=vec2(.105,.19);
  vec2 elbow=hilt-sideAxis*.13-attackAxis*.05;
  float upperArm=seg(e,shoulderR,elbow,.038);
  float foreArm=seg(e,elbow,hilt,.034);
  float supportArm=seg(e,shoulderL,hilt-attackAxis*.045,.031);
  c=mix(c,vec3(.22,.11,.075),smoothstep(.02,0.,min(upperArm,min(foreArm,supportArm))));

  vec2 bladeDir=vec2(sin(swordAngle),cos(swordAngle));
  float blade=seg(e,hilt-bladeDir*.045,hilt+bladeDir*.59,.017);
  float bladeHalo=seg(e,hilt-bladeDir*.045,hilt+bladeDir*.59,.048);
  float readPulse=tele*smoothstep(.45,1.,prog)*(.65+.35*sin(T*18.));
  c+=vec3(1.,.36,.12)*smoothstep(.07,0.,bladeHalo)*readPulse*.16;
  c=mix(c,vec3(.92,.94,.9),smoothstep(.015,0.,blade));
  float guard=seg(e,hilt-sideAxis*.055,hilt+sideAxis*.055,.015);
  c=mix(c,vec3(.12,.08,.05),smoothstep(.012,0.,guard));

  float trail=strike*sin(clamp(prog,0.,1.)*3.1415926);
  float trailAngle1=swordAngle-.18;
  float trailAngle2=swordAngle-.36;
  vec2 trailDir1=vec2(sin(trailAngle1),cos(trailAngle1));
  vec2 trailDir2=vec2(sin(trailAngle2),cos(trailAngle2));
  float trail1=seg(e,hilt+trailDir1*.02,hilt+trailDir1*.57,.031);
  float trail2=seg(e,hilt+trailDir2*.03,hilt+trailDir2*.54,.045);
  c+=vec3(1.,.33,.09)*smoothstep(.055,0.,trail1)*trail*.32;
  c+=vec3(.9,.16,.05)*smoothstep(.07,0.,trail2)*trail*.16;

  float contact=hitGlow*exp(-18.*abs(length(e-vec2(.02,.05))-.23));
  c+=vec3(1.,.55,.18)*contact*.18;

  float playerAngle=pdir*1.5708+(pact>.5?(pact>1.5?sin(T*16.)*.55:-.9+fract(T*3.)*1.8):-.6);
  vec2 playerHilt=uv-vec2(.34,-.47);
  vec2 playerDir=vec2(sin(playerAngle),cos(playerAngle));
  float playerBlade=seg(playerHilt,playerHilt-playerDir*.1,playerHilt+playerDir*.75,.026);
  c=mix(c,vec3(.95,.96,.9),smoothstep(.02,0.,playerBlade));

  c+=vec3(1.,.45,.18)*hitGlow*.2;
  return c;
}

void main(){
  vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;
  uv+=vec2(sin(T*61.),cos(T*53.))*shake*.002;
  vec3 c=paint(uv);
  float vig=1.-smoothstep(.32,.9,length(uv));
  O=vec4(c*(.5+.5*vig),1);
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

  draw(s, n) {
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
    this.gl.uniform1f(this.u.adir, D[s.attack?.displayedDirection]?.[2] || 0);
    this.gl.uniform1f(this.u.pact, action);
    this.gl.uniform1f(this.u.pdir, D[actionDir]?.[2] || 0);
    this.gl.uniform1f(this.u.hit, (n - hitAt) / 320);
    this.gl.uniform1f(this.u.stage, s.enemyIndex);
    this.gl.uniform1f(this.u.shake, shake);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

let view;
try {
  view = new View(canvas);
} catch (e) {
  console.error(e);
  unsupported.hidden = false;
  $('#start-button').disabled = true;
}

function say(a, b, d = 0) {
  msg = [a, b];
  msgUntil = d ? performance.now() + d : Infinity;
}

function fmt(n) {
  return Math.max(0, Math.round(n)).toString().padStart(6, '0');
}

function zone(d, bad = false) {
  const z = zones.find((x) => x.dataset.direction === d);
  if (!z) return;
  zones.forEach((x) => x.classList.remove('zone--active', 'zone--danger'));
  z.classList.add(bad ? 'zone--danger' : 'zone--active');
  setTimeout(() => z.classList.remove('zone--active', 'zone--danger'), 220);
}

function flash(bad = false) {
  U.flash.classList.toggle('impact-flash--hit', bad);
  U.flash.style.opacity = bad ? '.75' : '.7';
  setTimeout(() => (U.flash.style.opacity = '0'), 80);
}

function hud(s, n) {
  U.ph.style.transform = `scaleX(${s.playerHp / s.playerMaxHp})`;
  U.eh.style.transform = `scaleX(${s.enemyHp / s.enemy.maxHp})`;
  U.stage.textContent = `STAGE ${s.stage} / ${s.stageCount}`;
  U.enemy.textContent = s.enemy.name;
  U.arena.textContent = s.enemy.title;
  U.combo.textContent = `連擊 ${s.combo}`;
  U.score.textContent = fmt(s.score);
  const p = P[s.phase] || P.ready;
  U.phase.textContent = p[0];
  if (msg && n < msgUntil) {
    U.title.textContent = msg[0];
    U.sub.textContent = msg[1];
  } else {
    msg = null;
    U.title.textContent = p[1];
    U.sub.textContent = p[2];
  }
  const d = s.phase === 'telegraph' ? s.attack?.displayedDirection : s.phase === 'strike' ? s.attack?.direction : null;
  if (d) {
    U.arrow.textContent = D[d][0];
    U.dir.textContent = D[d][1];
    U.ind.classList.toggle('direction-indicator--danger', s.phase === 'strike');
    U.ind.classList.add('direction-indicator--visible');
  } else {
    U.ind.classList.remove('direction-indicator--visible', 'direction-indicator--danger');
  }
}

function events(n) {
  for (const e of engine.drainEvents()) {
    const d = e.detail;
    if (e.type === 'stage-start') {
      audio.cue('stage');
      say(`STAGE ${d.stage}`, d.enemyName, 1200);
    }
    if (e.type === 'telegraph') audio.cue('telegraph');
    if (e.type === 'feint') say('FEINT', '方向改變，重新判斷', 520);
    if (e.type === 'strike') audio.cue('strike');
    if (e.type === 'parry' || e.type === 'perfect-parry') {
      action = e.type === 'perfect-parry' ? 2 : 1;
      actionDir = d.direction;
      actionAt = n;
      shake = action === 2 ? 1.2 : 0.7;
      if (action === 2) pause = n + 48;
      audio.cue(action === 2 ? 'perfect' : 'parry');
      flash();
      navigator.vibrate?.(action === 2 ? [18, 20, 28] : 22);
      say(action === 2 ? 'PERFECT PARRY' : 'PARRY', '掃屏反擊', 620);
    }
    if (e.type === 'parry-miss') {
      zone(d.direction, true);
      say('MISS', d.reason === 'wrong-direction' ? '方向錯誤' : '時機未到', 380);
    }
    if (e.type === 'counter' || e.type === 'attack-miss') {
      action = 3;
      actionDir = d.direction;
      actionAt = n;
      audio.cue('slash');
      if (e.type === 'counter') {
        hitAt = n;
        shake = 0.65;
        pause = n + 34;
        audio.cue('enemy');
        flash();
        say(`-${d.damage} HP`, '命中', 420);
      } else {
        say('NO OPENING', '先格擋再反擊', 420);
      }
    }
    if (e.type === 'player-hit') {
      shake = 1.8;
      pause = n + 65;
      audio.cue('hit');
      flash(true);
      navigator.vibrate?.([40, 20, 40]);
      say(`-${d.damage} HP`, '攻擊突破防線', 620);
    }
    if (e.type === 'enemy-defeated') say('STAGE CLEAR', '收刀，準備下一場', 1100);
    if (e.type === 'victory' || e.type === 'defeat') {
      const win = e.type === 'victory';
      if (win) audio.cue('victory');
      U.re.textContent = win ? 'TRIAL COMPLETE' : 'THE BLADE FALLS';
      U.rt.textContent = win ? '勝利' : '敗北';
      U.rs.textContent = win ? '你已擊敗三名敵人。' : '觀察敵人最後一刻嘅刀路。';
      U.rscore.textContent = fmt(d.score);
      result.classList.add('modal--visible');
      run = false;
    }
  }
}

function begin() {
  audio.on().catch(() => {});
  start.classList.remove('modal--visible');
  result.classList.remove('modal--visible');
  engine.start(performance.now());
  action = 0;
  shake = 0;
  msg = null;
  run = true;
}

function end(e) {
  if (!ptr || ptr.id !== e.pointerId || !run) {
    ptr = null;
    return;
  }
  const r = canvas.getBoundingClientRect();
  const dx = e.clientX - ptr.x;
  const dy = e.clientY - ptr.y;
  const sw = performance.now() - ptr.t < 850 ? directionFromSwipe(dx, dy, Math.max(34, r.width * 0.085)) : null;
  if (sw) {
    zone(sw);
    const x = engine.attemptAttack(sw, performance.now());
    if (!x.accepted) {
      action = 3;
      actionDir = sw;
      actionAt = performance.now();
    }
  } else {
    const d = directionFromTap(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
    if (d) {
      zone(d);
      action = 1;
      actionDir = d;
      actionAt = performance.now();
      engine.attemptParry(d, performance.now());
    } else {
      say('EDGE INPUT', '點擊靠近畫面四邊先可格擋', 460);
    }
  }
  ptr = null;
}

function loop(n) {
  requestAnimationFrame(loop);
  const dt = Math.min(50, n - last);
  last = n;
  if (run && n >= pause) engine.update(n);
  events(n);
  const s = engine.snapshot(n);
  hud(s, n);
  shake = Math.max(0, shake - dt * 0.0048);
  if (action && n - actionAt > (action === 3 ? 390 : 290)) action = 0;
  view?.draw(s, n);
}

$('#start-button').addEventListener('click', begin);
$('#restart-button').addEventListener('click', () => {
  engine.reset(performance.now());
  begin();
});
canvas.addEventListener('pointerdown', (e) => {
  if (run && !ptr) {
    ptr = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() };
    canvas.setPointerCapture?.(e.pointerId);
  }
});
canvas.addEventListener('pointerup', end);
canvas.addEventListener('pointercancel', () => (ptr = null));
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
requestAnimationFrame(loop);
