export const MASTERY_GRADES = Object.freeze(['D', 'C', 'B', 'A', 'S']);

export function createMasterySession(startedAt = 0) {
  return {
    startedAt: Number.isFinite(startedAt) ? startedAt : 0,
    parryAttempts: 0,
    parries: 0,
    perfectParries: 0,
    guardBreaks: 0,
    counters: 0,
    hitsTaken: 0,
    damageTaken: 0,
    damageDealt: 0,
  };
}

export function observeMasteryEvent(session, event) {
  if (!session || !event?.type) return session;
  const detail = event.detail ?? {};

  if (event.type === 'parry-miss') {
    session.parryAttempts += 1;
  } else if (event.type === 'parry' || event.type === 'perfect-parry') {
    session.parryAttempts += 1;
    session.parries += 1;
    if (event.type === 'perfect-parry') session.perfectParries += 1;
  } else if (event.type === 'enemy-guard-break') {
    session.guardBreaks += 1;
  } else if (event.type === 'counter') {
    session.counters += 1;
    session.damageDealt += Math.max(0, Number(detail.damage) || 0);
  } else if (event.type === 'player-hit') {
    session.hitsTaken += 1;
    session.damageTaken += Math.max(0, Number(detail.damage) || 0);
  }

  return session;
}

export function gradeFromMastery(points, won = true) {
  if (!won) return 'D';
  if (points >= 90) return 'S';
  if (points >= 78) return 'A';
  if (points >= 66) return 'B';
  if (points >= 54) return 'C';
  return 'D';
}

export function finishMastery(session, { now = session?.startedAt ?? 0, score = 0, won = false } = {}) {
  const safe = session ?? createMasterySession();
  const elapsedMs = Math.max(0, (Number.isFinite(now) ? now : safe.startedAt) - safe.startedAt);
  const accuracy = safe.parryAttempts > 0 ? safe.parries / safe.parryAttempts : 0;
  const perfectRate = safe.parries > 0 ? safe.perfectParries / safe.parries : 0;
  const timeBonus = elapsedMs <= 60000 ? 5 : elapsedMs <= 90000 ? 3 : elapsedMs <= 120000 ? 1 : 0;

  let masteryPoints = 36;
  masteryPoints += accuracy * 20;
  masteryPoints += perfectRate * 18;
  masteryPoints += Math.min(10, safe.guardBreaks * 4);
  masteryPoints += Math.min(8, safe.counters);
  masteryPoints += timeBonus;
  masteryPoints -= safe.hitsTaken * 8;
  if (won) masteryPoints += 12;
  masteryPoints = Math.max(0, Math.min(100, Math.round(masteryPoints)));

  return Object.freeze({
    won: Boolean(won),
    score: Math.max(0, Math.round(Number(score) || 0)),
    masteryPoints,
    grade: gradeFromMastery(masteryPoints, won),
    elapsedMs,
    parryAttempts: safe.parryAttempts,
    parries: safe.parries,
    perfectParries: safe.perfectParries,
    guardBreaks: safe.guardBreaks,
    counters: safe.counters,
    hitsTaken: safe.hitsTaken,
    damageTaken: safe.damageTaken,
    damageDealt: safe.damageDealt,
    accuracy,
    perfectRate,
  });
}

export function isBetterMastery(candidate, incumbent) {
  if (!candidate) return false;
  if (!incumbent) return true;
  const candidatePoints = Number(candidate.masteryPoints) || 0;
  const incumbentPoints = Number(incumbent.masteryPoints) || 0;
  if (candidatePoints !== incumbentPoints) return candidatePoints > incumbentPoints;
  return (Number(candidate.score) || 0) > (Number(incumbent.score) || 0);
}

export function formatMasteryTime(ms) {
  const totalSeconds = Math.max(0, Math.floor((Number(ms) || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
