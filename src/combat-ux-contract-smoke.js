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

async function verifyProductionParry(canvas, rect, direction, x, y, pointerId, diagnosticKey) {
  const hitTarget = document.elementFromPoint(x, y);
  root.dataset[diagnosticKey] = describeTarget(hitTarget);
  const mapped = directionFromErgonomicTap(x - rect.left, y - rect.top, rect.width, rect.height);
  if (hitTarget !== canvas || mapped !== direction) return false;

  const before = root.dataset.combatUxProductionParry || 'none';
  dispatchViewportTap(hitTarget, x, y, pointerId);
  const routed = await waitFor(() => {
    const value = root.dataset.combatUxProductionParry || 'none';
    return value !== before && value.startsWith(`${direction}:`);
  }, 320);
  root.dataset[`${diagnosticKey}Result`] = root.dataset.combatUxProductionParry || 'none';
  return routed;
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
    document.querySelector('#pause-button') &&
    document.querySelector('#combat-guide-sheet') &&
    document.querySelector('#control-hand-toggle') &&
    document.querySelector('#footwork-step') &&
    document.querySelector('#footwork-range') &&
    document.querySelector('#footwork-feedback')
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

  if (!canvas || !startButton || !pauseButton || !pauseScreen || !pauseResume || !pauseGuide || !pauseRestart || !pauseHome || !guideSheet || !guideClose || !controlToggle || !footworkStep || !footworkRange || !footworkFeedback) {
    root.dataset.combatUxBrowser = 'fail-controls';
    return;
  }

  if (root.dataset.controlHand !== ControlHand.LEFT) controlToggle.click();
  await sleep(30);
  mark(
    'combatUxHandednessPersistent',
    root.dataset.controlHand === ControlHand.LEFT &&
      controlToggle.getAttribute('aria-pressed') === 'true' &&
      localStorage.getItem(CONTROL_HAND_STORAGE_KEY) === ControlHand.LEFT,
  );

  canvas.setPointerCapture = () => {};
  const duelStarted = await startProductionDuel(startButton, pauseButton);
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
  const stepRect = footworkStep.getBoundingClientRect();
  const rangeRect = footworkRange.getBoundingClientRect();
  const feedbackRect = footworkFeedback.getBoundingClientRect();
  footworkStep.classList.add('is-active');
  await sleep(20);
  const activeStepRect = footworkStep.getBoundingClientRect();
  footworkStep.classList.remove('is-active');
  mark(
    'combatUxHandednessLayout',
    footworkVisible &&
      root.dataset.controlHand === ControlHand.LEFT &&
      rectFitsSafeViewport(stepRect, safeBounds) &&
      rectFitsSafeViewport(activeStepRect, safeBounds) &&
      rectFitsSafeViewport(rangeRect, safeBounds) &&
      rectFitsSafeViewport(feedbackRect, safeBounds),
  );
  root.dataset.combatUxHandednessStepLeft = String(Math.round(stepRect.left));
  root.dataset.combatUxHandednessRangeLeft = String(Math.round(rangeRect.left));
  root.dataset.combatUxHandednessFeedbackLeft = String(Math.round(feedbackRect.left));

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

  const allPass = [
    'combatUxPortraitViewport',
    'combatUxBeginEntered',
    'combatUxBeginCompleted',
    'combatUxStartExecuted',
    'combatUxHandednessPersistent',
    'combatUxHandednessLayout',
    'combatUxHandednessDirectionSafe',
    'combatUxTopParryPath',
    'combatUxRightParryPath',
    'combatUxPauseHudSafe',
    'combatUxPauseHitIsolation',
    'combatUxPauseFreeze',
    'combatUxGuideKeepsPaused',
    'combatUxResume',
    'combatUxRestart',
    'combatUxHome',
  ].every((key) => root.dataset[key] === 'true');

  root.dataset.combatUxBrowser = allPass ? 'pass' : 'fail';
}

run().catch((error) => {
  console.error(error);
  root.dataset.combatUxBrowser = 'fail-error';
  root.dataset.combatUxRuntimeError = String(error?.message || error).slice(0, 240);
});
