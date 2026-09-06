import { CombatEngine, Direction } from './game-core.js';
import { requestChallenge } from './challenge-mode.js';

const root = document.documentElement;

function flush() {
  return Promise.resolve().then(() => Promise.resolve()).then(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

function showResult() {
  document.querySelector('#start-screen')?.classList.remove('modal--visible');
  document.querySelector('#pause-screen')?.classList.remove('modal--visible');
  document.querySelector('#result-screen')?.classList.add('modal--visible');
}

function replayLine() {
  return document.querySelector('#result-analysis [data-campaign-replay-objective]');
}

function inBounds(node) {
  const rect = node?.getBoundingClientRect();
  return Boolean(rect) && rect.width > 0 && rect.height > 0 &&
    rect.left >= -0.5 && rect.right <= window.innerWidth + 0.5 &&
    rect.top >= -0.5 && rect.bottom <= window.innerHeight + 0.5;
}

function injectDefeat(engine, { direction = Direction.TOP, score = 250 } = {}) {
  engine.events.push(
    { type: 'strike', detail: { direction } },
    { type: 'player-hit', detail: { direction, damage: 1 } },
    { type: 'defeat', detail: { score, playerHp: 0 } },
  );
  engine.drainEvents();
}

function assertSafeLine(line, label) {
  if (!inBounds(line) || !inBounds(document.querySelector('#result-analysis'))) {
    throw new Error(`${label} overflowed 320x568 production result`);
  }
  if (getComputedStyle(line).pointerEvents !== 'none') {
    throw new Error(`${label} unexpectedly owns pointer input`);
  }
}

function assertDocumentRenderable(label) {
  if (root.hidden || root.hasAttribute('hidden') || getComputedStyle(root).display === 'none') {
    throw new Error(`${label} hid the production document root`);
  }
}

try {
  requestChallenge(false);
  const first = new CombatEngine();
  first.start(0);
  first.drainEvents();
  injectDefeat(first, { score: 250 });
  await flush();
  showResult();
  await flush();

  const firstLine = replayLine();
  if (!firstLine || firstLine.hidden || firstLine.textContent.trim() !== '再戰目標 · 打入第2關') {
    throw new Error(`first campaign replay objective mismatch: ${firstLine?.textContent || 'missing'}`);
  }
  assertSafeLine(firstLine, 'first campaign replay objective');
  assertDocumentRenderable('first campaign replay objective');
  root.dataset.campaignReplaySmokeOffer = 'pass';

  const second = new CombatEngine();
  second.start(1000);
  second.drainEvents();
  second.events.push(
    { type: 'enemy-defeated', detail: { stage: 1 } },
    { type: 'stage-start', detail: { stage: 2, enemyId: 'wandering-ronin', enemyName: 'Wandering Ronin' } },
  );
  second.drainEvents();
  injectDefeat(second, { direction: Direction.RIGHT, score: 500 });
  await flush();

  const achievedLine = replayLine();
  if (!achievedLine || achievedLine.hidden || achievedLine.textContent.trim() !== '✓ 打入第2關 · 下一步 打入第3關') {
    throw new Error(`campaign replay completion mismatch: ${achievedLine?.textContent || 'missing'}`);
  }
  assertSafeLine(achievedLine, 'campaign replay completion');
  assertDocumentRenderable('campaign replay completion');
  root.dataset.campaignReplaySmokeAchieved = 'pass';

  requestChallenge(true);
  const challenge = new CombatEngine();
  challenge.start(2000);
  challenge.drainEvents();
  injectDefeat(challenge, { score: 300 });
  await flush();

  const quietLine = replayLine();
  if (quietLine && !quietLine.hidden) throw new Error(`challenge leaked campaign replay objective: ${quietLine.textContent}`);
  if (root.dataset.campaignReplayObjective) throw new Error('challenge retained campaign replay objective dataset');
  assertDocumentRenderable('challenge replay-objective isolation');
  requestChallenge(false);
  root.dataset.campaignReplaySmokeChallengeQuiet = 'pass';
  root.dataset.campaignReplaySmoke = 'pass';
} catch (error) {
  root.dataset.campaignReplaySmokeError = String(error?.stack || error).slice(0, 500);
  root.dataset.campaignReplaySmoke = 'fail';
}
