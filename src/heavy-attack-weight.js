const installed = Symbol.for('blade-reversal.heavy-attack-weight-v1');

const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

function smoother(value) {
  const x = clamp01(value);
  return clamp01(x * x * x * (x * (x * 6 - 15) + 10));
}

export function heavyAttackWeightFrame(state, out = {}) {
  const active = state?.attack?.heavy === true;
  const phase = state?.phase ?? 'ready';
  const p = clamp01(state?.phaseProgress);
  out.active = active;
  out.phase = phase;
  out.load = 0;
  out.drive = 0;
  out.follow = 0;
  out.read = 0;

  if (!active) return out;

  if (phase === 'telegraph') {
    out.load = smoother(p / 0.72);
    out.read = smoother((p - 0.16) / 0.66);
    return out;
  }

  if (phase === 'strike') {
    out.load = 1 - smoother(p / 0.28);
    out.drive = smoother(p / 0.56);
    out.follow = smoother((p - 0.56) / 0.44);
    out.read = 1 - smoother(p / 0.46);
    return out;
  }

  if (phase === 'recovery') {
    out.drive = 1 - smoother(p / 0.55);
    out.follow = 1 - smoother(p);
  }

  return out;
}

export function installHeavyAttackWeight(view) {
  if (!view || view[installed] || typeof view.draw !== 'function') return view;
  Object.defineProperty(view, installed, { value: true });

  const originalDraw = view.draw.bind(view);
  view.heavyAttackWeightState = heavyAttackWeightFrame(null, {});

  view.draw = (state, now, meta = {}) => {
    const result = originalDraw(state, now, meta);
    const frame = heavyAttackWeightFrame(state, view.heavyAttackWeightState);
    if (!frame.active) return result;

    const enemy = view.enemy;
    if (enemy?.getLocalPosition && enemy?.setLocalPosition) {
      const pos = enemy.getLocalPosition();
      const y = pos.y - frame.load * 0.045 - frame.drive * 0.030 - frame.follow * 0.012;
      const z = pos.z - frame.load * 0.065 + frame.drive * 0.130 + frame.follow * 0.045;
      enemy.setLocalPosition(pos.x, y, z);
    }

    const character = view.skinnedModel;
    if (character?.getLocalEulerAngles && character?.setLocalEulerAngles) {
      const euler = character.getLocalEulerAngles();
      character.setLocalEulerAngles(
        euler.x + frame.load * 5.5 - frame.drive * 7.5 + frame.follow * 3.0,
        euler.y,
        euler.z,
      );
    }

    const trail = view.skinnedReadTrail;
    if (trail?.enabled && trail?.getLocalScale && trail?.setLocalScale) {
      const scale = trail.getLocalScale();
      trail.setLocalScale(
        scale.x * (1 + frame.read * 0.18 + frame.drive * 0.16),
        scale.y * (1 + frame.read * 0.12 + frame.drive * 0.18),
        scale.z * (1 + frame.read * 0.16 + frame.drive * 0.12),
      );
    }

    const camera = view.camera;
    if (camera?.getPosition && camera?.setPosition && frame.drive > 0) {
      const pos = camera.getPosition();
      camera.setPosition(pos.x, pos.y + frame.drive * 0.010, pos.z + frame.drive * 0.035);
      camera.lookAt?.(0, 1.28, 0);
    }

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.heavyAttackWeight = 'load-drive-follow-v1';
      document.documentElement.dataset.heavyAttackPhase = frame.phase;
    }
    return result;
  };

  if (typeof document !== 'undefined') document.documentElement.dataset.heavyAttackWeightReady = 'true';
  return view;
}
