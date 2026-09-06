import { CombatEngine } from './game-core.js';
import {
  RUN_ANALYSIS_MODE,
  createRunAnalysisSession,
  finishRunAnalysis,
  observeRunAnalysisEvent,
  resolveRunAnalysisMode,
} from './run-analysis.js';
import {
  buildCampaignReplayObjective,
  evaluateCampaignReplayObjective,
  formatCampaignReplayLine,
} from './campaign-replay-objective-model.js';

const installed = Symbol.for('blade-reversal.campaign-replay-objective-v1');
const CHALLENGE_ACTIVE = Symbol.for('blade-reversal.challenge-active-v1');
const sessions = new WeakMap();
let pendingObjective = null;

function installStyles() {
  if (document.querySelector('style[data-campaign-replay-objective]')) return;
  const style = document.createElement('style');
  style.dataset.campaignReplayObjective = 'true';
  style.textContent = `
    .campaign-replay-objective{margin:7px 0 0;padding:6px 8px;border-top:1px solid rgba(228,182,107,.14);color:rgba(245,227,196,.78);font-size:10px;font-weight:800;line-height:1.3;text-align:left;pointer-events:none}
    .campaign-replay-objective[hidden]{display:none}
    .campaign-replay-objective.is-achieved{color:#f2dfbd}
    .campaign-replay-objective.is-missed{color:rgba(255,208,189,.82)}
  `;
  document.head.append(style);
}

function ensureLine() {
  const analysis = document.querySelector('#result-analysis');
  if (!analysis) return null;
  let line = analysis.querySelector('[data-campaign-replay-objective]');
  if (!line) {
    line = document.createElement('div');
    line.className = 'campaign-replay-objective';
    line.dataset.campaignReplayObjective = 'true';
    const grid = analysis.querySelector('[data-analysis-grid]');
    if (grid) grid.insertAdjacentElement('afterend', line);
    else analysis.append(line);
  }
  return line;
}

function renderReplayObjective(previous, next) {
  installStyles();
  const line = ensureLine();
  if (!line) return;
  const text = formatCampaignReplayLine(previous, next);
  line.hidden = !text;
  line.textContent = text;
  line.classList.toggle('is-achieved', Boolean(previous?.achieved));
  line.classList.toggle('is-missed', Boolean(previous && !previous.achieved));
  if (text) {
    document.documentElement.dataset.campaignReplayObjective = text;
    document.documentElement.dataset.campaignReplayObjectiveState = previous
      ? (previous.achieved ? 'achieved' : 'missed')
      : 'offered';
  } else {
    delete document.documentElement.dataset.campaignReplayObjective;
    delete document.documentElement.dataset.campaignReplayObjectiveState;
  }
}

function hideReplayObjective() {
  const analysis = document.querySelector('#result-analysis');
  const line = analysis?.querySelector('[data-campaign-replay-objective]');
  if (line) line.hidden = true;
  delete document.documentElement.dataset.campaignReplayObjective;
  delete document.documentElement.dataset.campaignReplayObjectiveState;
}

function modeFor(engine, event = null) {
  return resolveRunAnalysisMode({
    challenge: Boolean(engine?.[CHALLENGE_ACTIVE] || event?.detail?.challenge),
    dailyChallenge: Boolean(event?.detail?.dailyChallenge),
    practice: Boolean(event?.detail?.practice),
  });
}

export function installCampaignReplayObjective(Engine = CombatEngine) {
  if (typeof document === 'undefined' || !Engine?.prototype || Engine.prototype[installed]) return;
  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function campaignReplayObjectiveStart(now = 0) {
    sessions.set(this, {
      analysis: createRunAnalysisSession(),
      mode: null,
      activeObjective: null,
    });
    return originalStart.call(this, now);
  };

  Engine.prototype.drainEvents = function campaignReplayObjectiveDrainEvents() {
    const events = originalDrainEvents.call(this);
    const session = sessions.get(this);
    if (!session) return events;

    for (const event of events) {
      if (event.type === 'stage-start' && session.mode === null) {
        session.mode = modeFor(this, event);
        if (session.mode === RUN_ANALYSIS_MODE.CAMPAIGN && pendingObjective) {
          session.activeObjective = pendingObjective;
          pendingObjective = null;
        }
      }

      observeRunAnalysisEvent(session.analysis, event);
      if (event.type !== 'victory' && event.type !== 'defeat') continue;

      const mode = session.mode ?? modeFor(this, event);
      if (mode !== RUN_ANALYSIS_MODE.CAMPAIGN) {
        queueMicrotask(hideReplayObjective);
        continue;
      }

      const report = finishRunAnalysis(session.analysis, {
        won: event.type === 'victory',
        score: event.detail?.score,
      });
      const previous = session.activeObjective
        ? evaluateCampaignReplayObjective(session.activeObjective, report)
        : null;
      const next = previous && !previous.achieved
        ? session.activeObjective
        : buildCampaignReplayObjective(report);
      pendingObjective = next;
      queueMicrotask(() => renderReplayObjective(previous, next));
    }

    return events;
  };

  installStyles();
  document.documentElement.dataset.campaignReplayObjectiveReady = 'true';
}

if (typeof document !== 'undefined') installCampaignReplayObjective();
