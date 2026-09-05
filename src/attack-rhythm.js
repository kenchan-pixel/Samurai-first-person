import { CombatEngine } from './game-core.js';

const installed = Symbol.for('blade-reversal.attack-rhythm-v1');
const enginePatched = Symbol.for('blade-reversal.attack-rhythm-snapshot-v1');

const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const smoother = (value) => {
  const x = clamp01(value);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

export const AttackRhythm = Object.freeze({
  MEASURED: 'measured',
  STANDARD: 'standard',
  QUICK: 'quick',
  HEAVY: 'heavy',
});

export function installAttackRhythmSnapshot(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[enginePatched]) return;
  const originalSnapshot = Engine.prototype.snapshot;
  if (typeof originalSnapshot !== 'function') return;
  Object.defineProperty(Engine.prototype, enginePatched, { value: true });
  Engine.prototype.snapshot = function attackRhythmSnapshot(now) {
    const snapshot = originalSnapshot.call(this, now);
    if (snapshot?.attack && this.currentAttack) {
      snapshot.attack.telegraphMs = Number(this.currentAttack.telegraphMs) || 0;
      snapshot.attack.strikeMs = Number(this.currentAttack.strikeMs) || 0;
    }
    return snapshot;
  };
}

export function attackRhythmProfile(attack) {
  if (!attack) return AttackRhythm.STANDARD;
  if (attack.heavy === true) return AttackRhythm.HEAVY;
  const telegraphMs = Number(attack.telegraphMs);
  const strikeMs = Number(attack.strikeMs);
  if ((Number.isFinite(strikeMs) && strikeMs <= 180)
    || (Number.isFinite(strikeMs) && strikeMs <= 195 && Number.isFinite(telegraphMs) && telegraphMs <= 480)) {
    return AttackRhythm.QUICK;
  }
  if (Number.isFinite(telegraphMs) && Number.isFinite(strikeMs) && telegraphMs >= 700 && strikeMs >= 260) {
    return AttackRhythm.MEASURED;
  }
  return AttackRhythm.STANDARD;
}

export function attackRhythmFrame(state, out = {}) {
  const profile = attackRhythmProfile(state?.attack);
  const phase = state?.phase ?? 'ready';
  const p = clamp01(state?.phaseProgress);
  Object.assign(out, {
    profile,
    phase,
    load: 0,
    drive: 0,
    follow: 0,
    read: 0,
    bodyY: 0,
    bodyZ: 0,
    bodyPitch: 0,
    trailWidthGain: 0,
    trailLengthGain: 0,
  });

  if (profile === AttackRhythm.MEASURED) {
    if (phase === 'telegraph') {
      out.load = smoother(p / 0.88);
      out.read = smoother((p - 0.12) / 0.72);
    } else if (phase === 'strike') {
      out.load = 1 - smoother(p / 0.24);
      out.drive = smoother(p / 0.72);
      out.follow = smoother((p - 0.62) / 0.38);
      out.read = 1 - smoother(p / 0.62);
    } else if (phase === 'recovery') {
      out.follow = 1 - smoother(p);
    }
    out.bodyY = -out.load * 0.035 - out.drive * 0.010;
    out.bodyZ = -out.load * 0.035 + out.drive * 0.055 + out.follow * 0.018;
    out.bodyPitch = out.load * 3.2 - out.drive * 2.4 + out.follow * 0.8;
    out.trailWidthGain = out.read * 0.06 + out.drive * 0.06;
    out.trailLengthGain = out.read * 0.10 + out.drive * 0.08;
    return out;
  }

  if (profile === AttackRhythm.QUICK) {
    if (phase === 'telegraph') {
      out.load = smoother(p) * 0.28;
      out.read = smoother((p - 0.30) / 0.60) * 0.60;
    } else if (phase === 'strike') {
      out.load = (1 - smoother(p / 0.20)) * 0.22;
      out.drive = smoother(p / 0.38);
      out.follow = smoother((p - 0.38) / 0.62);
      out.read = 1 - smoother(p / 0.50);
    } else if (phase === 'recovery') {
      out.follow = 1 - smoother(p / 0.72);
    }
    out.bodyY = -out.load * 0.014 - out.drive * 0.012;
    out.bodyZ = -out.load * 0.014 + out.drive * 0.085 + out.follow * 0.026;
    out.bodyPitch = out.load * 1.4 - out.drive * 4.2 + out.follow * 1.1;
    out.trailWidthGain = out.read * 0.08 + out.drive * 0.16;
    out.trailLengthGain = out.read * 0.08 + out.drive * 0.22;
  }

  return out;
}

export function installAttackRhythm(view) {
  if (!view || view[installed] || typeof view.draw !== 'function') return view;
  Object.defineProperty(view, installed, { value: true });

  const originalDraw = view.draw.bind(view);
  view.attackRhythmState = attackRhythmFrame(null, {});

  view.draw = (state, now, meta = {}) => {
    const result = originalDraw(state, now, meta);
    const frame = attackRhythmFrame(state, view.attackRhythmState);

    if (frame.profile !== AttackRhythm.STANDARD && frame.profile !== AttackRhythm.HEAVY) {
      const enemy = view.enemy;
      if (enemy?.getLocalPosition && enemy?.setLocalPosition) {
        const pos = enemy.getLocalPosition();
        enemy.setLocalPosition(pos.x, pos.y + frame.bodyY, pos.z + frame.bodyZ);
      }

      const character = view.skinnedModel;
      if (character?.getLocalEulerAngles && character?.setLocalEulerAngles) {
        const euler = character.getLocalEulerAngles();
        character.setLocalEulerAngles(euler.x + frame.bodyPitch, euler.y, euler.z);
      }

      const trail = view.skinnedReadTrail;
      if (trail?.enabled && trail?.getLocalScale && trail?.setLocalScale) {
        const scale = trail.getLocalScale();
        trail.setLocalScale(
          scale.x * (1 + frame.trailWidthGain),
          scale.y * (1 + frame.trailLengthGain),
          scale.z,
        );
      }
    }

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.attackRhythm = frame.profile;
      document.documentElement.dataset.attackRhythmPhase = frame.phase;
    }
    return result;
  };

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.attackRhythmReady = 'true';
    document.documentElement.dataset.attackRhythmContract = 'measured-standard-quick-heavy-v1';
  }
  return view;
}

installAttackRhythmSnapshot();
