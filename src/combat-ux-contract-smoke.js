import { Direction, directionFromSwipe } from './game-core.js';
import { directionFromErgonomicTap, pauseRectIsTopRightHudSafe } from './combat-ux.js';
import { CONTROL_HAND_STORAGE_KEY, ControlHand } from './control-handedness.js';

const root = document.documentElement;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(check, timeout = 1800) {
  const started = performance.now();
  while (performance.now() - started < timeout) {
    if (check()) return true;
    await sleep(20);
  }
  return false;
}

function mark(name, value) {
  root.dataset[name] = String(Boolean(value));
}

function dispatchViewportTap(target, x, y, pointerId) {
  target.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    pointerId,
    pointerType: 'touch',
    clientX: x,
    clientY: y,
    isPrimary: true,
  }));
  target.dispatchEvent(new PointerEvent('pointerup', {
    bubbles: true,
    pointerId,
    pointerType: 'touch',
    clientX: x,
    clientY: y,
    isPrimary: true,
  }));
}

function dispatchViewportPointerStream(target, points, pointerId) {
  const sequence = [
    ['pointerdown', points[0]],
    ...points.slice(1, -1).map((point) => ['pointermove', point]),
    ['pointerup', points.at(-1)],
  ];
  for (const [type, point] of sequence) {
    target.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      pointerId,
      pointerType: 'touch',
      clientX: point.x,
      clientY: point.y,
      isPrimary: true,
    }));
  }
}

function describeTarget(target) {
  if (!target) return 'none';
  const id = target.id ? `#${target.id}` : '';
  const classes = typeof target.className === 'string' && target.className.trim()
    ? `.${target.className.trim().replace(/\s+/g, '.')}`
    : '';
  return `${target.tagName || 'node'}${id}${classes}`.slice(0, 160);
}

function measureSafeHorizontalBounds() {
  const app = document.querySelector('#app');
  if (!app) return null;
  const leftProbe = document.createElement('i');
  const rightProbe = document.createElement('i');
  leftProbe.style.cssText = 'position:absolute;left:var(--safe-left);top:0;width:0;height:0;pointer-events:none';
  rightProbe.style.cssText = 'position:absolute;right:var(--safe-right);top:0;width:0;height:0;pointer-events:none';
  app.append(leftProbe, rightProbe);
  const left = leftProbe.getBoundingClientRect().left;
  const right = rightProbe.getBoundingClientRect().right;
  leftProbe.remove();
  rightProbe.remove();
  return { left, right };
}

function rectFitsSafeViewport(rect, safeBounds) {
  if (!rect || !safeBounds) return false;
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.left >= safeBounds.left - 0.5 &&
    rect.right <= safeBounds.right + 0.5 &&
    rect.top >= -0.5 &&
    rect.bottom <= window.innerHeight + 0.5
  );
}

function rectsOverlap(a, b) {
  if (!a || !b || a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0) return false;
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function rectSummary(rect) {
  if (!rect) return 'none';
  return [rect.left, rect.top, rect.right, rect.bottom].map((value) => Math.round(value)).join(',');
}

async function verifyCampaignDuelReadProfile() {
  const card = document.querySelector('#duel-read-profile');
  const hud = document.querySelector('.hud');
  const prompt = document.querySelector('#combat-prompt');
  const pauseButton = document.querySelector('#pause-button');
  if (!card || !hud || !prompt || !pauseButton) return false;

  const visible = await waitFor(() =>
    root.dataset.combatPhase === 'stage-intro' &&
    root.dataset.duelReadProfileState === 'visible' &&
    root.dataset.duelReadProfile === 'ashigaru' &&
    !card.hidden,
  520);
  if (!visible) return false;

  const cardRect = card.getBoundingClientRect();
  const hudRect = hud.getBoundingClientRect();
  const promptRect = prompt.getBoundingClientRect();
  const pauseRect = pauseButton.getBoundingClientRect();
  const cardStyle = getComputedStyle(card);
  const promptStyle = getComputedStyle(prompt);
  const centerTarget = document.elementFromPoint(
    (cardRect.left + cardRect.right) / 2,
    (cardRect.top + cardRect.bottom) / 2,
  );
  const compositionSafe = Boolean(
    cardRect.width > 0 &&
    cardRect.height > 0 &&
    cardRect.left >= -0.5 &&
    cardRect.top >= -0.5 &&
    cardRect.right <= window.innerWidth + 0.5 &&
    cardRect.bottom <= window.innerHeight + 0.5 &&
    cardStyle.pointerEvents === 'none' &&
    centerTarget !== card &&
    !rectsOverlap(cardRect, hudRect) &&
    !rectsOverlap(cardRect, pauseRect) &&
    (promptStyle.display === 'none' || promptRect.width === 0 || promptRect.height === 0)
  );
  root.dataset.combatUxDuelReadCardRect = rectSummary(cardRect);
  root.dataset.combatUxDuelReadHudRect = rectSummary(hudRect);
  root.dataset.combatUxDuelReadPauseRect = rectSummary(pauseRect);
  root.dataset.combatUxDuelReadPromptDisplay = promptStyle.display;
  root.dataset.combatUxDuelReadCenterTarget = describeTarget(centerTarget);
  mark('combatUxDuelReadIntroComposition', compositionSafe);

  const clearsBeforeTelegraph = await waitFor(() =>
    root.dataset.combatPhase === 'telegraph' &&
    root.dataset.duelReadProfileState === 'hidden' &&
    card.hidden,
  1750);
  mark('combatUxDuelReadClearsBeforeTelegraph', clearsBeforeTelegraph);
  return compositionSafe && clearsBeforeTelegraph;
}

async function verifyChallengeDuelReadQuiet({ button, expectedDaily = false, pauseButton, pauseHome }) {
  const card = document.querySelector('#duel-read-profile');
  if (!button || !card || !pauseButton || !pauseHome) return false;
  button.click();
  const started = await waitFor(() =>
    root.dataset.challengeActive === 'true' &&
    root.dataset.combatPhase === 'stage-intro' &&
    (!expectedDaily || root.dataset.dailyChallengeActive === 'true'),
  720);
  const quiet = Boolean(
    started &&
    card.hidden &&
    root.dataset.duelReadProfileState !== 'visible'
  );
  if (!started) return false;
  pauseButton.click();
  await sleep(20);
  pauseHome.click();
  await sleep(40);
  return quiet && document.querySelector('#start-screen')?.classList.contains('modal--visible');
}

async function verifyProductionParry(canvas, rect, direction, x, y, pointerId, diagnosticKey) {
  const hitTarget = document.elementFromPoint(x, y);
  root.dataset[diagnosticKey] = describeTarget(hitTarget);
  const mapped = directionFromErgonomicTap(x - rect.left, y - rect.top, rect.width, rect.height);
  if (hitTarget !== canvas || mapped !== direction) return false;

  const probe = `probe:${pointerId}`;
  root.dataset.combatUxProductionParry = probe;
  dispatchViewportTap(hitTarget, x, y, pointerId);
  const routed = await waitFor(() => {
    const value = root.dataset.combatUxProductionParry || 'none';
    return value !== probe && value.startsWith(`${direction}:`);
  }, 320);
  root.dataset[`${diagnosticKey}Result`] = root.dataset.combatUxProductionParry || 'none';
  return routed;
}

async function selectControlHand(controlToggle, hand) {
  if (root.dataset.controlHand === hand && localStorage.getItem(CONTROL_HAND_STORAGE_KEY) !== hand) {
    controlToggle.click();
    await sleep(20);
    controlToggle.click();
  } else if (root.dataset.controlHand !== hand) {
    controlToggle.click();
  }
  await sleep(30);
  return (
    root.dataset.controlHand === hand &&
    localStorage.getItem(CONTROL_HAND_STORAGE_KEY) === hand &&
    controlToggle.getAttribute('aria-pressed') === String(hand === ControlHand.LEFT)
  );
}

async function verifyLowerInputOwnership({
  canvas,
  rect,
  controlToggle,
  footworkStep,
  footworkRange,
  footworkFeedback,
  safeBounds,
  hand,
  pointerBase,
}) {
  const selected = await selectControlHand(controlToggle, hand);
  const stepRect = footworkStep.getBoundingClientRect();
  const rangeRect = footworkRange.getBoundingClientRect();
  const feedbackRect = footworkFeedback.getBoundingClientRect();
  footworkStep.classList.add('is-active');
  await sleep(20);
  const activeStepRect = footworkStep.getBoundingClientRect();
  footworkStep.classList.remove('is-active');

  const sidePinned = hand === ControlHand.LEFT
    ? stepRect.left - safeBounds.left <= 8.5 && stepRect.right < rect.left + rect.width * 0.36
    : safeBounds.right - stepRect.right <= 8.5 && stepRect.left > rect.left + rect.width * 0.64;
  const layout = Boolean(
    selected &&
    sidePinned &&
    rectFitsSafeViewport(stepRect, safeBounds) &&
    rectFitsSafeViewport(activeStepRect, safeBounds) &&
    rectFitsSafeViewport(rangeRect, safeBounds) &&
    rectFitsSafeViewport(feedbackRect, safeBounds)
  );

  const bottomX = hand === ControlHand.LEFT ? stepRect.right + 8 : stepRect.left - 8;
  const bottomY = (stepRect.top + stepRect.bottom) / 2;
  const leftX = Math.max(rect.left + 2, safeBounds.left + 2);
  const leftY = hand === ControlHand.LEFT
    ? Math.max(rect.top + rect.height * 0.5, stepRect.top - 8)
    : rect.top + rect.height * 0.62;

  const bottom = await verifyProductionParry(
    canvas,
    rect,
    Direction.BOTTOM,
    bottomX,
    bottomY,
    pointerBase,
    `combatUx${hand}BottomHit`,
  );
  const left = await verifyProductionParry(
    canvas,
    rect,
    Direction.LEFT,
    leftX,
    leftY,
    pointerBase + 1,
    `combatUx${hand}LeftHit`,
  );

  const stepCenter = {
    x: (stepRect.left + stepRect.right) / 2,
    y: (stepRect.top + stepRect.bottom) / 2,
  };
  const observed = [];
  const onDown = () => observed.push('pointerdown');
  const onMove = () => observed.push('pointermove');
  const onUp = () => observed.push('pointerup');
  footworkStep.addEventListener('pointerdown', onDown);
  footworkStep.addEventListener('pointermove', onMove);
  footworkStep.addEventListener('pointerup', onUp);
  footworkStep.setPointerCapture = () => {};
  const beforeStepParry = root.dataset.combatUxProductionParry || 'none';
  dispatchViewportPointerStream(footworkStep, [
    stepCenter,
    { x: stepCenter.x + (hand === ControlHand.LEFT ? 6 : -6), y: stepCenter.y - 4 },
    { x: stepCenter.x + (hand === ControlHand.LEFT ? 9 : -9), y: stepCenter.y - 6 },
  ], pointerBase + 2);
  await sleep(30);
  footworkStep.removeEventListener('pointerdown', onDown);
  footworkStep.removeEventListener('pointermove', onMove);
  footworkStep.removeEventListener('pointerup', onUp);

  const stepExclusive = Boolean(
    document.elementFromPoint(stepCenter.x, stepCenter.y) === footworkStep &&
    observed.join('>') === 'pointerdown>pointermove>pointerup' &&
    (root.dataset.combatUxProductionParry || 'none') === beforeStepParry
  );
  const postStepBottom = await verifyProductionParry(
    canvas,
    rect,
    Direction.BOTTOM,
    bottomX,
    bottomY,
    pointerBase + 3,
    `combatUx${hand}PostStepBottomHit`,
  );

  return { selected, layout, bottom, left, stepExclusive, postStepBottom, stepRect, rangeRect, feedbackRect };
}

async function startProductionDuel(startButton, pauseButton) {
  root.dataset.combatUxStartExecuted = 'false';
  startButton.click();

  const started = await waitFor(() =>
    Boolean(root.dataset.combatUxRuntimeError) ||
    (
      root.dataset.combatUxBeginEntered === 'true' &&
      root.dataset.combatUxBeginCompleted === 'true' &&
      !document.querySelector('#start-screen')?.classList.contains('modal--visible') &&
      !pauseButton.hidden &&
      root.dataset.gamePaused === 'false' &&
      root.dataset.combatPhase !== 'ready'
    )
  , 1000);

  if (root.dataset.combatUxRuntimeError) {
    root.dataset.combatUxStartError = root.dataset.combatUxRuntimeError;
    return false;
  }

  mark('combatUxStartExecuted', started);
  return started;
}

async function run() {
  const ready = await waitFor(() =>
    root.dataset.startReady === 'true' &&
    root.dataset.startHandlerReady === 'true' &&
    root.dataset.combatUxReady === 'true' &&
    root.dataset.controlHandedness === 'persistent-v1' &&
    root.dataset.duelReadProfileReady === 'true' &&
    root.dataset.dailyChallengeReady === 'true' &&
    document.querySelector('#pause-button') &&
    document.querySelector('#combat-guide-sheet') &&
    document.querySelector('#control-hand-toggle') &&
    document.querySelector('#footwork-step') &&
    document.querySelector('#footwork-range') &&
    document.querySelector('#footwork-feedback') &&
    document.querySelector('#challenge-button') &&
    document.querySelector('#daily-challenge-button') &&
    document.querySelector('#duel-read-profile')
  );
  if (!ready) {
    root.dataset.combatUxBrowser = 'fail-ready';
    return;
  }

  const canvas = document.querySelector('#game-canvas');
  const startButton = document.querySelector('#start-button');
  const pauseButton = document.querySelector('#pause-button');
  const pauseScreen = document.querySelector('#pause-screen');
  const pauseResume = document.querySelector('#pause-resume-button');
  const pauseGuide = document.querySelector('#pause-guide-button');
  const pauseRestart = document.querySelector('#pause-restart-button');
  const pauseHome = document.querySelector('#pause-home-button');
  const guideSheet = document.querySelector('#combat-guide-sheet');
  const guideClose = guideSheet?.querySelector('.combat-guide__close');
  const controlToggle = document.querySelector('#control-hand-toggle');
  const footworkStep = document.querySelector('#footwork-step');
  const footworkRange = document.querySelector('#footwork-range');
  const footworkFeedback = document.querySelector('#footwork-feedback');
  const challengeButton = document.querySelector('#challenge-button');
  const dailyChallengeButton = document.querySelector('#daily-challenge-button');

  if (!canvas || !startButton || !pauseButton || !pauseScreen || !pauseResume || !pauseGuide || !pauseRestart || !pauseHome || !guideSheet || !guideClose || !controlToggle || !footworkStep || !footworkRange || !footworkFeedback || !challengeButton || !dailyChallengeButton) {
    root.dataset.combatUxBrowser = 'fail-controls';
    return;
  }

  await selectControlHand(controlToggle, ControlHand.RIGHT);
  mark(
    'combatUxHandednessPersistent',
    root.dataset.controlHand === ControlHand.RIGHT &&
      controlToggle.getAttribute('aria-pressed') === 'false' &&
      localStorage.getItem(CONTROL_HAND_STORAGE_KEY) === ControlHand.RIGHT,
  );

  canvas.setPointerCapture = () => {};
  const duelStarted = await startProductionDuel(startButton, pauseButton);
  const duelReadSafe = duelStarted && await verifyCampaignDuelReadProfile();
  if (!duelReadSafe) {
    root.dataset.combatUxBrowser = 'fail-duel-read-profile';
    return;
  }
  const liveReady = duelStarted && await waitFor(() =>
    !pauseButton.hidden &&
    root.dataset.gamePaused === 'false' &&
    root.dataset.pauseLayout === 'pass' &&
    root.dataset.pausePlacement === 'top-right' &&
    root.dataset.pauseInputSafe === 'pass'
  , 900);
  if (!liveReady) {
    root.dataset.combatUxBrowser = root.dataset.combatUxRuntimeError ? 'fail-start-runtime' : 'fail-live-layout';
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  root.dataset.combatUxViewport = `${viewportWidth}x${viewportHeight}`;
  root.dataset.combatUxCanvas = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
  const portraitViewport =
    viewportWidth === 320 &&
    viewportHeight === 568 &&
    Math.abs(rect.width - 320) < 1 &&
    Math.abs(rect.height - 568) < 1;
  mark('combatUxPortraitViewport', portraitViewport);
  if (!portraitViewport) {
    root.dataset.combatUxBrowser = 'fail-viewport';
    return;
  }

  const footworkVisible = await waitFor(() => !footworkStep.hidden && !footworkRange.hidden, 1800);
  const safeBounds = measureSafeHorizontalBounds();
  if (!footworkVisible || !safeBounds) {
    root.dataset.combatUxBrowser = 'fail-footwork-layout';
    return;
  }

  const rightOwnership = await verifyLowerInputOwnership({
    canvas,
    rect,
    controlToggle,
    footworkStep,
    footworkRange,
    footworkFeedback,
    safeBounds,
    hand: ControlHand.RIGHT,
    pointerBase: 811,
  });
  const leftOwnership = await verifyLowerInputOwnership({
    canvas,
    rect,
    controlToggle,
    footworkStep,
    footworkRange,
    footworkFeedback,
    safeBounds,
    hand: ControlHand.LEFT,
    pointerBase: 821,
  });

  mark('combatUxHandednessLayout', rightOwnership.layout && leftOwnership.layout);
  mark(
    'combatUxBottomParryOwnership',
    rightOwnership.bottom &&
      rightOwnership.postStepBottom &&
      leftOwnership.bottom &&
      leftOwnership.postStepBottom,
  );
  mark('combatUxLeftParryOwnership', rightOwnership.left && leftOwnership.left);
  mark('combatUxStepPointerIsolation', rightOwnership.stepExclusive && leftOwnership.stepExclusive);
  root.dataset.combatUxRightStepLeft = String(Math.round(rightOwnership.stepRect.left));
  root.dataset.combatUxLeftStepLeft = String(Math.round(leftOwnership.stepRect.left));
  root.dataset.combatUxHandednessRangeLeft = String(Math.round(leftOwnership.rangeRect.left));
  root.dataset.combatUxHandednessFeedbackLeft = String(Math.round(leftOwnership.feedbackRect.left));

  const swipeThreshold = Math.max(34, rect.width * 0.085);
  mark(
    'combatUxHandednessDirectionSafe',
    directionFromSwipe(80, 0, swipeThreshold) === Direction.RIGHT &&
      directionFromSwipe(-80, 0, swipeThreshold) === Direction.LEFT &&
      directionFromSwipe(0, -80, swipeThreshold) === Direction.TOP &&
      directionFromSwipe(0, 80, swipeThreshold) === Direction.BOTTOM,
  );

  const topX = rect.left + rect.width * 0.5;
  const topY = rect.top + rect.height * 0.36;
  mark('combatUxTopParryPath', await verifyProductionParry(canvas, rect, 'top', topX, topY, 801, 'combatUxTopHit'));

  const rightX = rect.right - 8;
  const rightY = rect.top + rect.height * 0.5;
  mark('combatUxRightParryPath', await verifyProductionParry(canvas, rect, 'right', rightX, rightY, 802, 'combatUxRightHit'));

  const pauseRect = pauseButton.getBoundingClientRect();
  const localPauseRect = {
    left: pauseRect.left - rect.left,
    top: pauseRect.top - rect.top,
    right: pauseRect.right - rect.left,
    bottom: pauseRect.bottom - rect.top,
  };
  mark(
    'combatUxPauseHudSafe',
    pauseRectIsTopRightHudSafe(localPauseRect, rect.width, rect.height) &&
      root.dataset.pausePlacement === 'top-right' &&
      root.dataset.pauseInputSafe === 'pass' &&
      root.dataset.pauseLayout === 'pass',
  );

  const pauseCenterX = (pauseRect.left + pauseRect.right) / 2;
  const pauseCenterY = (pauseRect.top + pauseRect.bottom) / 2;
  const pauseOwnsTap = document.elementFromPoint(pauseCenterX, pauseCenterY) === pauseButton;
  const topNeighborX = pauseRect.left - 8;
  const topNeighborY = pauseCenterY;
  const rightNeighborX = pauseCenterX;
  const rightNeighborY = pauseRect.bottom + 8;
  const topNeighborTarget = document.elementFromPoint(topNeighborX, topNeighborY);
  const rightNeighborTarget = document.elementFromPoint(rightNeighborX, rightNeighborY);
  root.dataset.combatUxPauseHit = describeTarget(document.elementFromPoint(pauseCenterX, pauseCenterY));
  root.dataset.combatUxPauseTopNeighbor = describeTarget(topNeighborTarget);
  root.dataset.combatUxPauseRightNeighbor = describeTarget(rightNeighborTarget);
  mark(
    'combatUxPauseHitIsolation',
    pauseOwnsTap &&
      topNeighborTarget === canvas &&
      rightNeighborTarget === canvas &&
      directionFromErgonomicTap(topNeighborX - rect.left, topNeighborY - rect.top, rect.width, rect.height) === 'top' &&
      directionFromErgonomicTap(rightNeighborX - rect.left, rightNeighborY - rect.top, rect.width, rect.height) === 'right',
  );

  pauseButton.click();
  await sleep(40);
  const frozenPhase = root.dataset.combatPhase;
  const opened = root.dataset.gamePaused === 'true' && !pauseScreen.hidden;
  await sleep(1750);
  mark('combatUxPauseFreeze', opened && root.dataset.gamePaused === 'true' && root.dataset.combatPhase === frozenPhase);

  pauseGuide.click();
  await sleep(30);
  const guideOpened = !guideSheet.hidden && root.dataset.gamePaused === 'true';
  guideClose.click();
  await sleep(30);
  mark('combatUxGuideKeepsPaused', guideOpened && guideSheet.hidden && root.dataset.gamePaused === 'true' && !pauseScreen.hidden);

  pauseResume.click();
  await sleep(40);
  mark(
    'combatUxResume',
    root.dataset.gamePaused === 'false' &&
      pauseScreen.hidden &&
      !pauseButton.hidden &&
      root.dataset.pausePlacement === 'top-right' &&
      root.dataset.pauseInputSafe === 'pass',
  );

  pauseButton.click();
  await sleep(20);
  pauseRestart.click();
  await sleep(80);
  mark('combatUxRestart', root.dataset.gamePaused === 'false' && pauseScreen.hidden && !document.querySelector('#start-screen')?.classList.contains('modal--visible') && document.querySelector('#stage-label')?.textContent?.includes('STAGE 1 / 4'));

  pauseButton.click();
  await sleep(20);
  pauseHome.click();
  await sleep(40);
  mark('combatUxHome', document.querySelector('#start-screen')?.classList.contains('modal--visible') && pauseScreen.hidden && pauseButton.hidden);

  mark('combatUxDuelReadChallengeQuiet', await verifyChallengeDuelReadQuiet({
    button: challengeButton,
    pauseButton,
    pauseHome,
  }));
  mark('combatUxDuelReadDailyQuiet', await verifyChallengeDuelReadQuiet({
    button: dailyChallengeButton,
    expectedDaily: true,
    pauseButton,
    pauseHome,
  }));

  const allPass = [
    'combatUxPortraitViewport',
    'combatUxBeginEntered',
    'combatUxBeginCompleted',
    'combatUxStartExecuted',
    'combatUxHandednessPersistent',
    'combatUxHandednessLayout',
    'combatUxHandednessDirectionSafe',
    'combatUxBottomParryOwnership',
    'combatUxLeftParryOwnership',
    'combatUxStepPointerIsolation',
    'combatUxTopParryPath',
    'combatUxRightParryPath',
    'combatUxPauseHudSafe',
    'combatUxPauseHitIsolation',
    'combatUxPauseFreeze',
    'combatUxGuideKeepsPaused',
    'combatUxResume',
    'combatUxRestart',
    'combatUxHome',
    'combatUxDuelReadIntroComposition',
    'combatUxDuelReadClearsBeforeTelegraph',
    'combatUxDuelReadChallengeQuiet',
    'combatUxDuelReadDailyQuiet',
  ].every((key) => root.dataset[key] === 'true');

  root.dataset.combatUxBrowser = allPass ? 'pass' : 'fail';
}

run().catch((error) => {
  console.error(error);
  root.dataset.combatUxBrowser = 'fail-error';
  root.dataset.combatUxRuntimeError = String(error?.message || error).slice(0, 240);
});
