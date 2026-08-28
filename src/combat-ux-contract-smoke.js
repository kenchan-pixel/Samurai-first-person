import { directionFromErgonomicTap, rectIsNeutralForErgonomicTap } from './combat-ux.js';

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
    document.querySelector('#pause-button') &&
    document.querySelector('#combat-guide-sheet')
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

  if (!canvas || !startButton || !pauseButton || !pauseScreen || !pauseResume || !pauseGuide || !pauseRestart || !pauseHome || !guideSheet || !guideClose) {
    root.dataset.combatUxBrowser = 'fail-controls';
    return;
  }

  canvas.setPointerCapture = () => {};
  const duelStarted = await startProductionDuel(startButton, pauseButton);
  const liveReady = duelStarted && await waitFor(() =>
    !pauseButton.hidden &&
    root.dataset.gamePaused === 'false' &&
    root.dataset.pauseLayout === 'pass' &&
    root.dataset.pauseInputSafe === 'pass'
  , 900);
  if (!liveReady) {
    root.dataset.combatUxBrowser = root.dataset.combatUxRuntimeError ? 'fail-start-runtime' : 'fail-live-layout';
    return;
  }

  const rect = canvas.getBoundingClientRect();
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
    'combatUxPauseNeutral',
    rectIsNeutralForErgonomicTap(localPauseRect, rect.width, rect.height) &&
      root.dataset.pauseInputSafe === 'pass' &&
      root.dataset.pauseLayout === 'pass',
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
    'combatUxStartExecuted',
    'combatUxTopParryPath',
    'combatUxRightParryPath',
    'combatUxPauseNeutral',
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
