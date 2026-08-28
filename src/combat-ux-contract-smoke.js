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

function zoneRouted(direction) {
  const zone = document.querySelector(`.zone[data-direction="${direction}"]`);
  return Boolean(zone?.classList.contains('zone--active') || zone?.classList.contains('zone--danger'));
}

function dispatchCanvasTap(canvas, x, y, pointerId) {
  canvas.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    pointerId,
    pointerType: 'touch',
    clientX: x,
    clientY: y,
    isPrimary: true,
  }));
  canvas.dispatchEvent(new PointerEvent('pointerup', {
    bubbles: true,
    pointerId,
    pointerType: 'touch',
    clientX: x,
    clientY: y,
    isPrimary: true,
  }));
}

async function run() {
  const ready = await waitFor(() =>
    root.dataset.startReady === 'true' &&
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
  startButton.click();
  await sleep(80);

  const rect = canvas.getBoundingClientRect();
  dispatchCanvasTap(canvas, rect.left + rect.width * 0.5, rect.top + rect.height * 0.36, 801);
  mark('combatUxTopParryPath', zoneRouted('top'));
  await sleep(260);

  dispatchCanvasTap(canvas, rect.right - 8, rect.top + rect.height * 0.5, 802);
  mark('combatUxRightParryPath', zoneRouted('right'));
  await sleep(260);

  const pauseRect = pauseButton.getBoundingClientRect();
  const neutralBounds =
    pauseRect.left > rect.left + rect.width * 0.28 &&
    pauseRect.right < rect.left + rect.width * 0.72 &&
    pauseRect.top > rect.top + rect.height * 0.42 &&
    pauseRect.bottom < rect.top + rect.height * 0.72;
  mark('combatUxPauseNeutral', neutralBounds && root.dataset.pauseInputSafe === 'pass' && root.dataset.pauseLayout === 'pass');

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
  await sleep(1700);
  mark('combatUxResume', root.dataset.gamePaused === 'false' && pauseScreen.hidden && root.dataset.combatPhase !== frozenPhase);

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
});
