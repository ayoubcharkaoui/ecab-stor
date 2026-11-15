/* ECAB STOR — Android TV / Google TV / Smart TV keyboard & remote navigation.
   Does not replace the site's catalog, payment or GitHub download logic. */
(() => {
  'use strict';
  const ROOT = document.documentElement;
  const W = window;
  const D = document;
  const $ = selector => D.querySelector(selector);
  const ALL = selector => Array.from(D.querySelectorAll(selector));
  const NAV_KEYS = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
  const TV_AGENT = /(Android\s?TV|Google\s?TV|SMART[- ]?TV|HbbTV|Tizen|webOS|NetCast|BRAVIA|AppleTV|CrKey|AFT[BMST]|TV\s?Browser)/i;
  const storage = {
    get(key) {try{return localStorage.getItem(key)}catch{return null}},
    set(key,value) {try{localStorage.setItem(key,value)}catch{}}
  };
  const params = new URLSearchParams(W.location.search);
  const explicitlyTv = params.get('tv');
  const savedPreference = storage.get('ecab-tv-mode');
  let enabled = explicitlyTv === '1' || explicitlyTv === 'true' ||
    (explicitlyTv !== '0' && explicitlyTv !== 'false' && (savedPreference === 'on' || (savedPreference !== 'off' && TV_AGENT.test(navigator.userAgent))));
  let active = null;
  let lastBeforeDialog = null;
  let movingByRemote = false;
  let helpTimer = 0;
  const selector = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';
  const isEditable = node => Boolean(node && (node.matches('input,textarea,select,[contenteditable="true"]') || node.closest('[contenteditable="true"]')));
  const isOpen = () => Boolean($('#detailDialog')?.open || $('#detailDialog')?.hasAttribute('open'));
  const langIsArabic = () => ROOT.lang !== 'en';

  function visible(el) {
    if (!el || !el.isConnected || el.disabled || el.getAttribute('aria-hidden') === 'true' || el.closest('[hidden],[inert],[aria-hidden="true"]')) return false;
    if (el.closest('.skip-link') && el !== D.activeElement) return false;
    const style = W.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.visibility !== 'collapse' && el.getClientRects().length > 0;
  }
  function candidates() {
    const area = isOpen() ? $('#detailDialog') : D;
    if (!area) return [];
    return Array.from(area.querySelectorAll(selector)).filter(visible);
  }
  function rect(el) {
    const r = el.getBoundingClientRect();
    return {x:r.left+r.width/2,y:r.top+r.height/2,l:r.left,t:r.top,r:r.right,b:r.bottom,w:r.width,h:r.height};
  }
  function setFocus(el) {
    if (!el || !visible(el)) return;
    if (active && active !== el) active.classList.remove('tv-nav-active');
    active = el;
    movingByRemote = true;
    try{el.focus({preventScroll:true})}catch{el.focus()}
    el.classList.add('tv-nav-active');
    el.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
    movingByRemote = false;
  }
  function chooseNext(direction) {
    const items = candidates();
    const from = visible(D.activeElement) ? D.activeElement : null;
    if (!from || !items.includes(from)) {
      setFocus((isOpen() ? $('#dialogClose') : $('#apps .filter.active')) || items[0]);
      return true;
    }
    const origin = rect(from);
    const horizontal = direction === 'ArrowLeft' || direction === 'ArrowRight';
    const sign = direction === 'ArrowLeft' || direction === 'ArrowUp' ? -1 : 1;
    let best = null;
    let bestScore = Infinity;
    for (const el of items) {
      if (el === from || from.contains(el) || el.contains(from)) continue;
      const r = rect(el);
      const primary = sign * ((horizontal ? r.x-origin.x : r.y-origin.y));
      if (primary <= 7) continue;
      const secondary = horizontal ? Math.abs(r.y-origin.y) : Math.abs(r.x-origin.x);
      const originSpan = horizontal ? [origin.t,origin.b] : [origin.l,origin.r];
      const targetSpan = horizontal ? [r.t,r.b] : [r.l,r.r];
      const overlap = Math.min(originSpan[1],targetSpan[1]) - Math.max(originSpan[0],targetSpan[0]);
      // Prefer the same visual row/column, then the closest reachable target.
      const score = primary + secondary*(overlap>0 ? .22 : 1.95) + (overlap<0 ? 25 : 0);
      if (score < bestScore) {bestScore=score;best=el}
    }
    if (best) {setFocus(best);return true}
    // At the end of a row/page, a directional key can still scroll the document.
    if (!isOpen() && !horizontal) {
      W.scrollBy({top:sign * W.innerHeight * .65,behavior:'instant'});
      return true;
    }
    return false;
  }
  function renderCardFocusables() {
    if (!enabled) return;
    ALL('#appsGrid .app-card').forEach(card => {
      if (card.hasAttribute('data-tv-card')) return;
      card.setAttribute('tabindex','0');
      card.setAttribute('data-tv-card','');
      const title = card.querySelector('h3')?.textContent?.trim() || 'App';
      card.setAttribute('aria-label',`${title} — ${langIsArabic() ? 'اضغط OK للتفاصيل' : 'Press OK for details'}`);
    });
  }
  function updateControls() {
    const btn = $('#tvModeButton');
    if (btn) {
      btn.setAttribute('aria-pressed',String(enabled));
      btn.setAttribute('aria-label',langIsArabic() ? (enabled?'إيقاف وضع التلفاز':'تفعيل وضع التلفاز') : (enabled?'Turn off TV mode':'Turn on TV mode'));
      btn.title=langIsArabic() ? 'وضع التلفاز والريموت' : 'TV and remote mode';
    }
    const tips = $('#tvRemoteHelp');
    if (tips) tips.innerHTML = langIsArabic()
      ? '<kbd>↑ ↓ ← →</kbd><span>التنقل</span><kbd>OK</kbd><span>اختيار</span><kbd>Back</kbd><span>رجوع</span>'
      : '<kbd>↑ ↓ ← →</kbd><span>Navigate</span><kbd>OK</kbd><span>Select</span><kbd>Back</kbd><span>Go back</span>';
    renderCardFocusables();
  }
  function hideHelpLater() {
    clearTimeout(helpTimer);
    $('#tvRemoteHelp')?.classList.remove('tv-help-hidden');
    helpTimer=W.setTimeout(()=>$('#tvRemoteHelp')?.classList.add('tv-help-hidden'),13000);
  }
  function mode(value, persist, focusInitial=true) {
    enabled=Boolean(value);
    ROOT.classList.toggle('tv-mode',enabled);
    if (persist) {
      storage.set('ecab-tv-mode',enabled?'on':'off');
      if (params.has('tv')) {
        const u=new URL(W.location.href);u.searchParams.delete('tv');
        W.history.replaceState(null,'',u.pathname+u.search+u.hash);
      }
    }
    updateControls();
    if (enabled) {
      hideHelpLater();
      if (focusInitial) W.requestAnimationFrame(()=>setFocus($('#apps .filter.active') || $('.hero-buttons .button-lime')));
    } else {
      clearTimeout(helpTimer);
      active?.classList.remove('tv-nav-active');
      active=null;
      ALL('[data-tv-card]').forEach(card => {
        card.removeAttribute('tabindex');
        card.removeAttribute('data-tv-card');
        card.removeAttribute('aria-label');
      });
      $('#tvRemoteHelp')?.classList.add('tv-help-hidden');
    }
  }
  function handleBack(event) {
    const dialog = $('#detailDialog');
    if (isOpen()) {
      event.preventDefault();
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      return true;
    }
    const nav = $('#mainNav');
    if (nav?.classList.contains('open')) {
      event.preventDefault();
      nav.classList.remove('open');
      $('#menuBtn')?.setAttribute('aria-expanded','false');
      return true;
    }
    if (D.activeElement?.closest('.app-card')) {
      event.preventDefault();
      setFocus($('#apps .filter.active')||$('#apps .filter'));
      return true;
    }
    return false;
  }
  function setup() {
    const container = $('.header-actions');
    if (!container) return;
    const btn=D.createElement('button');
    btn.type='button';btn.id='tvModeButton';btn.className='tv-mode-toggle';
    btn.innerHTML='<span class="tv-screen-symbol" aria-hidden="true">▣</span><span>TV</span>';
    btn.addEventListener('click',()=>mode(!enabled,true));
    container.insertBefore(btn,container.firstChild);
    const help=D.createElement('div');
    help.id='tvRemoteHelp';help.className='tv-remote-help';help.setAttribute('aria-hidden','true');
    D.body.appendChild(help);

    // app.js builds the catalog dynamically, also on language/filter/search changes.
    const grid=$('#appsGrid');
    if (grid) new MutationObserver(renderCardFocusables).observe(grid,{childList:true});
    $('#languageBtn')?.addEventListener('click',()=>W.setTimeout(updateControls,0));

    D.addEventListener('focusin',event=>{
      if (!enabled) return;
      if (active&&active!==event.target)active.classList.remove('tv-nav-active');
      active=event.target;
      if (!isEditable(active)) active.classList.add('tv-nav-active');
    });
    D.addEventListener('focusout',event=>{
      if (event.target!==D.activeElement)event.target.classList.remove('tv-nav-active');
    });
    grid?.addEventListener('click',event=>{
      if (event.target.closest('[data-details]')) lastBeforeDialog=event.target.closest('[data-details]');
    },true);
    D.addEventListener('click',event=>{
      if (enabled && event.target.closest('[data-tv-card]') && !event.target.closest('a,button,input')) {
        const detail=event.target.closest('[data-tv-card]').querySelector('[data-details]');
        if (detail) {lastBeforeDialog=event.target.closest('[data-tv-card]');detail.click()}
      }
    });
    const dialog=$('#detailDialog');
    dialog?.addEventListener('close',()=>{
      if (enabled) W.requestAnimationFrame(()=>setFocus(visible(lastBeforeDialog)?lastBeforeDialog:$('#apps .filter.active')));
    });
    D.addEventListener('keydown',event=>{
      const key=event.key;
      // Android TV browsers may advertise themselves as generic Android browsers.
      if (!enabled && NAV_KEYS.has(key) && /Android/i.test(navigator.userAgent) &&
          W.innerWidth>=680 && !isEditable(event.target)) mode(true,false,false);
      if (!enabled) return;
      if (key === 'Escape' || key === 'BrowserBack' || key === 'GoBack' ||
         (key === 'Backspace' && !isEditable(event.target))) {
        if (handleBack(event)) return;
      }
      if (key === 'Select' || key === 'Accept' || key === 'OK' || key === 'GamepadA') {
        if (visible(D.activeElement) && !isEditable(D.activeElement)) {
          event.preventDefault();
          D.activeElement.click();
        }
        return;
      }
      if (key === 'Enter' && D.activeElement?.matches('[data-tv-card]')) {
        event.preventDefault();
        lastBeforeDialog=D.activeElement;
        D.activeElement.querySelector('[data-details]')?.click();
        return;
      }
      if (!NAV_KEYS.has(key)) return;
      if (isEditable(D.activeElement) && (key==='ArrowLeft' || key==='ArrowRight')) return;
      if (isEditable(D.activeElement) && key==='ArrowUp' && D.activeElement.matches('textarea')) return;
      const used=chooseNext(key);
      if (used) event.preventDefault();
    },true);

    mode(enabled,false,enabled);
  }
  if (D.readyState==='loading') D.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();
