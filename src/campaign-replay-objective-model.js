const CAMPAIGN_STAGE_COUNT = 4;

function stagesOf(report) {
  return Array.isArray(report?.stages) ? report.stages : [];
}

function total(report, key) {
  return stagesOf(report).reduce((sum, stage) => sum + Math.max(0, Number(stage?.[key]) || 0), 0);
}

function perfectTotal(report) {
  return total(report, 'perfectParries') + total(report, 'perfectSteps');
}

export function buildCampaignReplayObjective(report) {
  const stages = stagesOf(report);
  if (!stages.length) return null;

  const stageReached = Math.max(1, Math.min(CAMPAIGN_STAGE_COUNT, Number(report?.stageReached) || stages.length));
  if (!report?.won) {
    if (stageReached < CAMPAIGN_STAGE_COUNT) {
      const targetStage = stageReached + 1;
      return Object.freeze({ id: 'reach-stage', value: targetStage, label: `打入第${targetStage}關` });
    }
    return Object.freeze({ id: 'win-campaign', value: 1, label: '擊敗赤將軍' });
  }

  const hitsTaken = total(report, 'hitsTaken');
  if (hitsTaken > 0) {
    const targetHits = Math.max(0, hitsTaken - 1);
    return Object.freeze({ id: 'max-hits', value: targetHits, label: `全程受擊 ≤ ${targetHits}` });
  }

  const missedCounters = total(report, 'missedCounters');
  if (missedCounters > 0) {
    return Object.freeze({ id: 'zero-missed-counters', value: 0, label: '反擊空隙零漏失' });
  }

  const perfects = perfectTotal(report);
  const targetPerfects = Math.max(1, Math.min(5, perfects + 1));
  return Object.freeze({ id: 'perfect-count', value: targetPerfects, label: `Perfect ≥ ${targetPerfects}` });
}

export function evaluateCampaignReplayObjective(objective, report) {
  if (!objective || !Array.isArray(report?.stages) || !report.stages.length) return null;
  let achieved = false;

  if (objective.id === 'reach-stage') {
    achieved = Math.max(0, Number(report.stageReached) || 0) >= objective.value;
  } else if (objective.id === 'win-campaign') {
    achieved = Boolean(report.won);
  } else if (objective.id === 'max-hits') {
    achieved = total(report, 'hitsTaken') <= objective.value;
  } else if (objective.id === 'zero-missed-counters') {
    achieved = total(report, 'missedCounters') === 0;
  } else if (objective.id === 'perfect-count') {
    achieved = perfectTotal(report) >= objective.value;
  }

  return Object.freeze({ ...objective, achieved });
}

export function formatCampaignReplayLine(previous, next) {
  if (previous) {
    return previous.achieved
      ? `✓ ${previous.label} · 下一步 ${next?.label || '保持節奏'}`
      : `未達 · ${previous.label} · 再戰`;
  }
  return next ? `再戰目標 · ${next.label}` : '';
}
