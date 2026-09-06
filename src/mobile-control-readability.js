export function installMobileControlReadability() {
  if (typeof document === 'undefined' || document.querySelector('style[data-mobile-control-readability]')) return;
  const style = document.createElement('style');
  style.dataset.mobileControlReadability = 'true';
  style.textContent = `
    .footwork-step{width:76px!important;height:76px!important;right:calc(var(--safe-right) + 8px)!important;bottom:calc(var(--safe-bottom) + 40px)!important;font-size:16px!important;font-weight:850!important;letter-spacing:.08em!important;line-height:1!important;opacity:.86!important}
    .footwork-step span{display:none!important}
    .footwork-range{right:calc(var(--safe-right) + 12px)!important;bottom:calc(var(--safe-bottom) + 122px)!important;font-size:11px!important;font-weight:760!important;padding:5px 9px!important}
    .footwork-feedback{right:calc(var(--safe-right) + 8px)!important;bottom:calc(var(--safe-bottom) + 158px)!important;width:146px!important;font-size:12px!important;font-weight:720!important;line-height:1.3!important}
    @media (max-width:360px){
      .footwork-step{width:70px!important;height:70px!important;right:calc(var(--safe-right) + 4px)!important;bottom:calc(var(--safe-bottom) + 36px)!important;font-size:14.5px!important}
      .footwork-range{right:calc(var(--safe-right) + 8px)!important;bottom:calc(var(--safe-bottom) + 113px)!important;font-size:10.5px!important}
      .footwork-feedback{right:calc(var(--safe-right) + 5px)!important;bottom:calc(var(--safe-bottom) + 147px)!important;width:136px!important;font-size:11.5px!important}
    }
  `;
  document.head.append(style);
  document.documentElement.dataset.mobileControlReadability = 'phone-v2';
}
