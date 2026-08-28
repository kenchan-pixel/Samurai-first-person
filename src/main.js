import { CombatEngine, Direction, directionFromSwipe } from './game-core.js';
import { View } from './renderer.js';
import { motionPhaseForSnapshot } from './animation-motion.js';
import { PausableCombatClock, directionFromErgonomicTap, installCombatUx } from './combat-ux.js';

installCombatUx();

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
  pauseButton: $('#pause-button'),
  pauseScreen: $('#pause-screen'),
  pauseResume: $('#pause-resume-button'),
  pauseGuide: $('#pause-guide-button'),
  pauseRestart: $('#pause-restart-button'),
  pauseHome: $('#pause-home-button'),
};

const zones = [...document.querySelectorAll('.zone')];
const engine = new CombatEngine();
const clock = new PausableCombatClock(performance.now());
const D = {
  [Direction.TOP]: ['↑', '上段', 0],
  [Direction.RIGHT]: ['→', '右方', 1],
  [Direction.BOTTOM]: ['↓', '下段', 2],
  [Direction.LEFT]: ['←', '左方', 3],
};
const P = {
  ready: ['待命', 'READ THE BLADE', '觀察敵人起手 · 連續格擋可破架勢'],
  'stage-intro': ['敵人進場', 'DUEL BEGINS', '先讀動作，累積敵人架勢'],
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
let hitStopUntil = 0;
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

let view;
try {
  view = new View(canvas);
  document.documentElement.dataset.webgl = 'ready';
  document.documentElement.dataset.visualIdentity = 'wide-samurai-v2';
} catch (e) {
  console.error(e);
  unsupported.hidden = false;
  $('#start-button').disabled = true;
  document.documentElement.dataset.webgl = 'failed';
}
document.documentElement.dataset.startReady = String(!$('#start-button').disabled);
document.documentElement.dataset.gamePaused = 'false';

function say(a, b, d = 0) {
  msg = [a, b];
  msgUntil = d ? clock.now + d : Infinity;
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
  U.combo.textContent = `架勢 ${s.playerPosture}/${s.playerPostureMax}`;
  U.score.textContent = `敵勢 ${s.enemyPosture}/${s.enemyPostureMax}`;
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
  document.documentElement.dataset.combatPhase = s.phase;
}

function setPauseUi(paused) {
  if (U.pauseScreen) U.pauseScreen.hidden = !paused;
  if (U.pauseButton) U.pauseButton.hidden = paused || !run;
  document.documentElement.dataset.gamePaused = String(Boolean(paused));
}

function pauseGame() {
  if (!run || clock.paused) return;
  ptr = null;
  clock.pause();
  setPauseUi(true);
}

function resumeGame() {
  if (!run || !clock.paused) return;
  clock.resume();
  setPauseUi(false);
  audio.on().catch(() => {});
}

function returnHome() {
  ptr = null;
  run = false;
  clock.pause();
  engine.reset(clock.now);
  result.classList.remove('modal--visible');
  start.classList.add('modal--visible');
  msg = null;
  action = 0;
  shake = 0;
  setPauseUi(false);
}

function events(n) {
  for (const e of engine.drainEvents()) {
    const d = e.detail;
    if (e.type === 'stage-start') {
      audio.cue('stage');
      say(`STAGE ${d.stage}`, d.enemyName, 900);
    }
    if (e.type === 'telegraph') audio.cue('telegraph');
    if (e.type === 'feint') say('FEINT', '方向改變，重新判斷', 420);
    if (e.type === 'strike') audio.cue('strike');
    if (e.type === 'parry' || e.type === 'perfect-parry') {
      action = e.type === 'perfect-parry' ? 2 : 1;
      actionDir = d.direction;
      actionAt = n;
      shake = action === 2 ? 1.2 : 0.7;
      if (action === 2) hitStopUntil = n + 48;
      audio.cue(action === 2 ? 'perfect' : 'parry');
      flash();
      navigator.vibrate?.(action === 2 ? [18, 20, 28] : 22);
    }
    if (e.type === 'enemy-guard-break') {
      shake = 1.4;
      hitStopUntil = n + 58;
      audio.cue('perfect');
      flash();
      navigator.vibrate?.([24, 18, 34]);
    }
    if (e.type === 'parry-miss') {
      zone(d.direction, true);
      say('MISS', d.reason === 'wrong-direction' ? '方向錯誤' : '時機未到', 320);
    }
    if (e.type === 'counter' || e.type === 'attack-miss') {
      action = 3;
      actionDir = d.direction;
      actionAt = n;
      audio.cue('slash');
      if (e.type === 'counter') {
        hitAt = n;
        shake = d.guardBroken ? 1.1 : 0.65;
        hitStopUntil = n + (d.guardBroken ? 52 : 34);
        audio.cue('enemy');
        flash();
        say(d.guardBroken ? `BREAK -${d.damage} HP` : `-${d.damage} HP`, d.guardBroken ? '破防重擊' : '命中', 420);
      } else {
        say('NO OPENING', '先格擋再反擊', 340);
      }
    }
    if (e.type === 'player-hit') {
      shake = d.guardBroken ? 2.3 : 1.8;
      hitStopUntil = n + (d.guardBroken ? 82 : 65);
      audio.cue('hit');
      flash(true);
      navigator.vibrate?.(d.guardBroken ? [55, 20, 55] : [40, 20, 40]);
      say(d.guardBroken ? 'GUARD BROKEN' : `-${d.damage} HP`, d.guardBroken ? `架勢崩潰 · -${d.damage} HP` : '攻擊突破防線', 560);
    }
    if (e.type === 'enemy-defeated') say('STAGE CLEAR', '收刀，準備下一場', 850);
    if (e.type === 'victory' || e.type === 'defeat') {
      const win = e.type === 'victory';
      if (win) audio.cue('victory');
      U.re.textContent = win ? 'TRIAL COMPLETE' : 'THE BLADE FALLS';
      U.rt.textContent = win ? '勝利' : '敗北';
      U.rs.textContent = win ? '你已完成四場決鬥。' : '觀察敵人最後一刻嘅刀路。';
      U.rscore.textContent = fmt(d.score);
      result.classList.add('modal--visible');
      run = false;
      clock.pause();
      setPauseUi(false);
    }
  }
}

function begin() {
  audio.on().catch(() => {});
  start.classList.remove('modal--visible');
  result.classList.remove('modal--visible');
  clock.reset(performance.now());
  engine.start(clock.now);
  action = 0;
  shake = 0;
  msg = null;
  hitStopUntil = 0;
  run = true;
  setPauseUi(false);
}

function end(e) {
  if (!ptr || ptr.id !== e.pointerId || !run || clock.paused) {
    ptr = null;
    return;
  }
  const r = canvas.getBoundingClientRect();
  const dx = e.clientX - ptr.x;
  const dy = e.clientY - ptr.y;
  const sw = clock.now - ptr.t < 850 ? directionFromSwipe(dx, dy, Math.max(34, r.width * 0.085)) : null;
  if (sw) {
    zone(sw);
    const x = engine.attemptAttack(sw, clock.now);
    if (!x.accepted) {
      action = 3;
      actionDir = sw;
      actionAt = clock.now;
    }
  } else {
    const d = directionFromErgonomicTap(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
    if (d) {
      zone(d);
      action = 1;
      actionDir = d;
      actionAt = clock.now;
      engine.attemptParry(d, clock.now);
    }
  }
  ptr = null;
}

function loop(realNow) {
  requestAnimationFrame(loop);
  const { now, frameDt } = clock.tick(realNow);
  if (run && !clock.paused && now >= hitStopUntil) engine.update(now);
  events(now);
  const s = engine.snapshot(now);
  hud(s, now);
  shake = Math.max(0, shake - frameDt * 0.0048);
  if (action && now - actionAt > (action === 3 ? 390 : 290)) action = 0;
  const motionPhase = motionPhaseForSnapshot(s);
  const renderState = motionPhase === s.phase ? s : { ...s, phase: motionPhase };
  view?.draw(renderState, now, {
    attackDirectionIndex: D[s.attack?.displayedDirection]?.[2] || 0,
    playerAction: action,
    playerDirectionIndex: D[actionDir]?.[2] || 0,
    hitAge: (now - hitAt) / 320,
    shake,
  });
}

$('#start-button').addEventListener('click', begin);
$('#restart-button').addEventListener('click', () => {
  engine.reset(clock.now);
  begin();
});
U.pauseButton?.addEventListener('click', pauseGame);
U.pauseResume?.addEventListener('click', resumeGame);
U.pauseGuide?.addEventListener('click', () => $('#combat-guide-button')?.click());
U.pauseRestart?.addEventListener('click', () => {
  setPauseUi(false);
  $('#restart-button').click();
});
U.pauseHome?.addEventListener('click', returnHome);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !run || !$('#combat-guide-sheet')?.hidden) return;
  if (clock.paused) resumeGame();
  else pauseGame();
});
canvas.addEventListener('pointerdown', (e) => {
  if (run && !clock.paused && !ptr) {
    ptr = { id: e.pointerId, x: e.clientX, y: e.clientY, t: clock.now };
    canvas.setPointerCapture?.(e.pointerId);
  }
});
canvas.addEventListener('pointerup', end);
canvas.addEventListener('pointercancel', () => (ptr = null));
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
requestAnimationFrame(loop);
