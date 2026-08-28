import { CombatEngine } from './game-core.js';

const root = document.documentElement;
const isCombatUxSmoke = new URLSearchParams(location.search).get('browser-smoke') === 'combat-ux';

if (isCombatUxSmoke) {
  root.dataset.startHandlerReady = 'false';
  root.dataset.combatUxRuntimeError = '';
  root.dataset.combatUxProductionParry = 'none';

  const formatError = (value) => {
    const text = value?.message || value?.reason?.message || value?.reason || value || 'unknown runtime error';
    return String(text).slice(0, 240);
  };

  window.addEventListener('error', (event) => {
    root.dataset.combatUxRuntimeError = formatError(event.error || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    root.dataset.combatUxRuntimeError = formatError(event.reason);
  });

  const originalAttemptParry = CombatEngine.prototype.attemptParry;
  CombatEngine.prototype.attemptParry = function observedAttemptParry(direction, now) {
    const result = originalAttemptParry.call(this, direction, now);
    const outcome = result?.accepted ? 'accepted' : (result?.reason || 'rejected');
    root.dataset.combatUxProductionParry = `${direction}:${outcome}`;
    return result;
  };

  const startButton = document.querySelector('#start-button');
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function observedAddEventListener(type, listener, options) {
    const result = originalAddEventListener.call(this, type, listener, options);
    if (this === startButton && type === 'click') {
      root.dataset.startHandlerReady = 'true';
      EventTarget.prototype.addEventListener = originalAddEventListener;
    }
    return result;
  };
}
