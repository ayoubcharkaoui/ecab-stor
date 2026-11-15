(() => {
  'use strict';
  const DEVELOPER_URL = 'https://play.google.com/store/apps/developer?id=ecab&hl=en';
  const apps = Array.isArray(window.ECAB_APPS) ? window.ECAB_APPS : [];
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const storage = {get: k => {try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
  const safe = input => String(input ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const url = input => {try{const u = new URL(String(input ?? ''));return ['http:','https:'].includes(u.protocol) ? u.href : ''}catch{return ''}};
  const mediaUrl = input => {
    const raw = String(input ?? '').trim();
    if (/^assets\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|svg)$/i.test(raw) && !raw.includes('..')) return raw;
    return url(raw);
  };
  const icon = (id, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#ico-${id}"></use></svg>`;
  const dictionary = {
    ar: {
      skip:'تجاوز للتطبيقات',topStrip:'موقع واحد، لكل تطبيقات ECAB',developerPage:'صفحتنا فـ Google Play',navHome:'الرئيسية',navApps:'التطبيقات',navStudio:'الاستوديو',navContact:'تواصل معنا',browseApps:'شوف التطبيقات',heroEyebrow:'تطبيقات من صنع ECAB',heroTitleOne:'أفكار صغيرة.',heroTitleTwo:'فائدة كبيرة.',heroLead:'تطبيقات عملية صايبينها بعناية، باش تولّي بعض تفاصيل نهارك أسهل. اكتشف التطبيقات ديالنا، وحمّلها مباشرة من المصدر الرسمي.',heroExplore:'استكشف التطبيقات',heroGoogle:'Google Play',heroCountSuffix:'تطبيقات فالمكتبة',catalogKicker:'مكتبة التطبيقات',catalogHeading:'لقَى التطبيق اللي يناسبك.',catalogSub:'جميع التطبيقات ديال ECAB فبلاصة وحدة، بروابط مباشرة وآمنة.',catalogCountLabel:'تطبيقات فالمكتبة',filterAll:'الكل',searchPlaceholder:'قلّب على تطبيق...',emptyTitle:'ما لقيناش تطبيقات بهاد البحث',emptyDescription:'جرب تبدّل البحث أو اختار جميع التطبيقات.',clearFilters:'عرض جميع التطبيقات',windowsNoteTitle:'ShareNet: استقبال الإنترنت عبر VPN محلي',windowsNote:'شارك الإنترنت من Share Net with Proxy فالهاتف، واستقبلو على Android Phone أو Android TV عبر VPN محلي، وعلى Windows عبر TUN محلي. خاص الأجهزة تكون قابلة للتواصل عبر الشبكة.',studioKicker:'علاش ECAB؟',studioHeading:'كنآمنو أن التطبيق الزوين،<br/>هو اللي <em>ينفعك.</em>',studioDescription:'كنخدمو على أدوات سهلة ومفيدة للحياة اليومية، ونهتمّو بالتفاصيل اللي كتفرّق فالتجربة. من Android حتى البرامج اللي غادي تجي لـ Windows.',benefit1:'روابط رسمية ومباشرة',benefit2:'تجارب بسيطة وعملية',benefit3:'تطبيقات متنوعة',contactKicker:'خلّينا على تواصل',contactTitle:'عندك فكرة، اقتراح<br/>أو شي سؤال؟',contactDescription:'مرحبا برسالتك. كيسعدنا نسمعو الملاحظات والأفكار اللي تقدر تحسّن التطبيقات ديالنا.',contactButton:'تواصل معنا',footerDesc:'تطبيقات بسيطة، صايبة الفرق.',rights:'جميع الحقوق محفوظة.',moreDetails:'التفاصيل',download:'حمّل التطبيق',store:'افتح Google Play',downloadDirect:'حمّل EXE لــ Windows',downloadApk:'حمّل APK',downloadViaGithub:'حمّل من GitHub',pendingRelease:'بانتظار إصدار التحميل',githubRelease:'GitHub Releases · ECAB',platform:'المنصة',features:'شنو كيوفّر؟',screenshots:'صور من التطبيق',noScreenshots:'الصور غادي تتزاد من بعد.',source:'روابط التحميل الرسمية',missingLink:'رابط التحميل مازال ما تزادش',title:'ECAB STOR — تطبيقات تستاهل بلاصتها عندك'
    },
    en: {
      skip:'Skip to apps',topStrip:'One home for every ECAB app',developerPage:'Our Google Play profile',navHome:'Home',navApps:'Apps',navStudio:'The studio',navContact:'Contact',browseApps:'Explore apps',heroEyebrow:'INDEPENDENT APPS BY ECAB',heroTitleOne:'Small ideas.',heroTitleTwo:'Big impact.',heroLead:'Useful apps, thoughtfully built to make the little things in everyday life a little easier. Browse the collection and download directly from official sources.',heroExplore:'Explore apps',heroGoogle:'Google Play',heroCountSuffix:'apps in the catalog',catalogKicker:'THE COLLECTION',catalogHeading:'Find your next favorite app.',catalogSub:'Every ECAB app, in one place — with direct links to official downloads.',catalogCountLabel:'apps in our catalog',filterAll:'All',searchPlaceholder:'Search apps...',emptyTitle:'No apps found',emptyDescription:'Try another search or browse all apps.',clearFilters:'Show all apps',windowsNoteTitle:'ShareNet: receive internet through a local VPN',windowsNote:'Share internet from the Share Net with Proxy phone app; receive it on Android Phone or TV via a local VPN, or on Windows via a local TUN interface. Devices must be network-reachable.',studioKicker:'OUR APPROACH',studioHeading:'Great apps aren’t just beautiful.<br/>They’re <em>useful.</em>',studioDescription:'We create approachable, useful software for daily life, with extra care for all the little details. Android today, with room for future Windows projects.',benefit1:'Official download links',benefit2:'Practical by design',benefit3:'A growing collection',contactKicker:'GET IN TOUCH',contactTitle:'An idea, feedback<br/>or a question?',contactDescription:'We love hearing what could make these apps even better. Reach out with your thoughts and suggestions.',contactButton:'Say hello',footerDesc:'Small apps. Meaningful impact.',rights:'All rights reserved.',moreDetails:'Details',download:'Download the app',store:'Open Google Play',downloadDirect:'Download Windows EXE',downloadApk:'Download Android APK',downloadViaGithub:'Download via GitHub',pendingRelease:'Release not published yet',githubRelease:'GitHub Releases · ECAB',platform:'Platform',features:'What’s inside',screenshots:'App screenshots',noScreenshots:'Screenshots coming soon.',source:'Official download links',missingLink:'Download link is not available yet',title:'ECAB STOR — Apps built to be useful'
    }
  };
  let lang = storage.get('ecab-language') === 'en' ? 'en' : 'ar';
  let theme = storage.get('ecab-theme') === 'light' ? 'light' : 'dark';
  let selectedFilter = 'all';
  let query = '';
  let toastTimer = 0;
  const t = key => dictionary[lang][key] || key;
  const local = (field, fallback = '') => typeof field === 'string' ? field : (field && (field[lang] || field.en || field.ar)) || fallback;
  const githubRelease = app => {
    const repo = String(window.ECAB_GITHUB_RELEASES?.repository || '').trim();
    const asset = String(app.releaseAsset || '').trim();
    if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo) || !/^[a-zA-Z0-9_.-]+\.(apk|exe|msi)$/i.test(asset)) return '';
    return `https://github.com/${repo}/releases/latest/download/${encodeURIComponent(asset)}`;
  };
  const getDownload = app => app.platform === 'android' && url(app.playUrl)
    ? url(app.playUrl) : (url(app.downloadUrl) || githubRelease(app));
  const onPlay = app => app.platform === 'android' && Boolean(url(app.playUrl));
  const downloadLabel = app => onPlay(app) ? t('store') : (app.platform === 'windows' ? t('downloadDirect') : t('downloadApk'));
  // A single Android APK can legitimately support both phones and Android TV.
  // The legacy deviceType field is still supported for existing catalog entries.
  const supportedDevices = app => {
    if (app.platform === 'windows') return ['windows'];
    const declared = Array.isArray(app.supportedDevices)
      ? app.supportedDevices.filter(device => device === 'phone' || device === 'tv') : [];
    if (declared.length) return [...new Set(declared)];
    return app.deviceType === 'both' ? ['phone', 'tv'] : [app.deviceType === 'tv' ? 'tv' : 'phone'];
  };
  const deviceLabel = device => device === 'phone' ? 'Android Phone' : (device === 'tv' ? 'Android TV' : 'Windows');
  const platformLabel = app => supportedDevices(app).map(deviceLabel).join(' · ');
  const roleLabel = app => app.role === 'receiver' ? (lang === 'ar' ? 'مستقبل · Receiver' : 'Receiver') : (app.role === 'source' ? (lang === 'ar' ? 'مرسل · Source' : 'Source') : '');
  const sourceLabel = app => onPlay(app) ? 'Google Play · ECAB' : (getDownload(app) ? t('githubRelease') : t('pendingRelease'));
  const appMatches = a => {
    const matchesPlatform = selectedFilter === 'all' || supportedDevices(a).includes(selectedFilter);
    const allText = [a.name?.ar,a.name?.en,a.category?.ar,a.category?.en,a.tagline?.ar,a.tagline?.en,a.description?.ar,a.description?.en,a.platform,platformLabel(a),a.role || ''].join(' ').toLocaleLowerCase();
    return matchesPlatform && (!query || allText.includes(query));
  };
  function renderCard(app, i) {
    const title = safe(local(app.name));
    const link = getDownload(app);
    const picture = mediaUrl(app.screenshots?.[0]);
    const appIcon = mediaUrl(app.icon);
    const tone = ['blue','sage','coral'].includes(app.accent) ? app.accent : 'sage';
    const primaryText = downloadLabel(app);
    const primaryBtn = link ? `<a class="card-link primary" href="${safe(link)}" aria-label="${safe(primaryText)} — ${title}" target="_blank" rel="noopener noreferrer">${icon('up-right')}</a>` : `<button class="card-link" disabled aria-label="${safe(t('missingLink'))}">${icon('up-right')}</button>`;
    const image = picture ? `<img class="card-photo tall" src="${safe(picture)}" loading="lazy" referrerpolicy="no-referrer" alt="${title} screenshot" onerror="this.style.display='none'"/>` : '';
    const platformChips = supportedDevices(app).map(device => `<span class="platform-chip">${icon(device === 'phone' ? 'phone' : 'monitor')}${deviceLabel(device)}</span>`).join('');
    return `<article class="app-card"><div class="card-media tone-${tone}"><span class="card-image-number">ECAB / ${String(i+1).padStart(2,'0')}</span><span class="card-badge">${safe(app.label || 'ECAB STOR')}</span>${image}<span class="card-hero-icon">${appIcon ? `<img src="${safe(appIcon)}" alt="${title} icon" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'"/>` : safe(title.slice(0,1))}</span></div><div class="card-content"><div class="card-meta"><span>${safe(local(app.category))}</span><span class="platform-chips">${platformChips}</span></div><h3>${title}</h3>${roleLabel(app) ? `<span class="app-role-tag role-${safe(app.role)}">${safe(roleLabel(app))}</span>` : ''}<p class="card-tagline">${safe(local(app.tagline))}</p><div class="card-bottom"><span class="play-label">${link ? (onPlay(app) ? 'AVAILABLE ON GOOGLE PLAY' : 'GITHUB RELEASES') : (app.releaseAsset ? 'RELEASE COMING SOON' : 'NOT AVAILABLE')}</span><span class="card-bottom-actions"><button class="card-link" type="button" data-details="${safe(app.id)}" aria-label="${safe(t('moreDetails'))} — ${title}">${icon('arrow','arrow-rtl')}</button>${primaryBtn}</span></div></div></article>`;
  }
  function renderCards() {
    const visible = apps.filter(appMatches);
    $('#appsGrid').innerHTML = visible.map(renderCard).join('');
    $('#emptyState').hidden = visible.length !== 0;
    const count = String(apps.length).padStart(2,'0');
    $('#heroCount').textContent = count;
    $('#catalogCount').textContent = count;
    $('#allNumber').textContent = count;
  }
  function openApp(id) {
    const app = apps.find(x => x.id === id);
    if (!app) return;
    const title = safe(local(app.name));
    const iconUrl = mediaUrl(app.icon);
    const shots = (Array.isArray(app.screenshots) ? app.screenshots : []).map(mediaUrl).filter(Boolean);
    const features = Array.isArray(app.features?.[lang]) ? app.features[lang] : (app.features?.en || app.features?.ar || []);
    const link = getDownload(app);
    const action = downloadLabel(app);
    $('#dialogContent').innerHTML = `<div class="dialog-top">${iconUrl ? `<img class="dialog-icon" src="${safe(iconUrl)}" alt="${title} icon" onerror="this.style.display='none'"/>` : ''}<div><span class="dialog-kicker">${safe(app.label || 'ECAB STOR')} · ${platformLabel(app).toUpperCase()}</span><h2 id="dialogTitle">${title}</h2><p>${safe(local(app.category))}</p></div></div><p class="dialog-desc">${safe(local(app.description))}</p><h3 class="dialog-section-title">${safe(t('screenshots'))}</h3>${shots.length ? `<div class="dialog-shots">${shots.map((shot, i) => `<img src="${safe(shot)}" loading="lazy" alt="${title} — ${i + 1}" referrerpolicy="no-referrer" onerror="this.style.display='none'"/>`).join('')}</div>` : `<p class="dialog-desc">${safe(t('noScreenshots'))}</p>`}<h3 class="dialog-section-title">${safe(t('features'))}</h3><div class="dialog-features">${features.map(f => `<span>${icon('check')}${safe(f)}</span>`).join('')}</div><div class="dialog-bottom"><div class="dialog-source"><strong>${safe(t('source'))}</strong><br/>${safe(sourceLabel(app))}</div>${link ? `<a class="button button-lime" href="${safe(link)}" target="_blank" rel="noopener noreferrer"><span>${safe(action)}</span>${icon('up-right')}</a>` : `<button class="button button-ghost" disabled>${safe(t('missingLink'))}</button>`}</div>`;
    const dialog = $('#detailDialog');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open','');
  }
  function applyLanguage() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('title');
    $$('[data-i18n]').forEach(node => {node.textContent = t(node.dataset.i18n);});
    $$('[data-i18n-html]').forEach(node => {node.innerHTML = t(node.dataset.i18nHtml);});
    $$('[data-i18n-placeholder]').forEach(node => {node.placeholder = t(node.dataset.i18nPlaceholder);});
    $('#languageBtn').textContent = lang === 'ar' ? 'EN' : 'عربي';
    renderCards();
  }
  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    $('#themeBtn').innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
    $('#themeBtn').setAttribute('aria-label',theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  function showToast(message) {
    const toast = $('#toast');toast.textContent = message;toast.classList.add('show');
    clearTimeout(toastTimer);toastTimer = setTimeout(() => toast.classList.remove('show'),3000);
  }
  $('#languageBtn').addEventListener('click', () => {lang=lang==='ar'?'en':'ar';storage.set('ecab-language',lang);applyLanguage();});
  $('#themeBtn').addEventListener('click', () => {theme=theme==='dark'?'light':'dark';storage.set('ecab-theme',theme);applyTheme();});
  $('#searchInput').addEventListener('input', e => {query = e.target.value.trim().toLocaleLowerCase();renderCards();});
  $$('[data-filter]').forEach(btn => btn.addEventListener('click', () => {selectedFilter=btn.dataset.filter;$$('[data-filter]').forEach(b => b.classList.toggle('active',b===btn));renderCards();}));
  $('#clearFilters').addEventListener('click', () => {selectedFilter='all';query='';$('#searchInput').value='';$$('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));renderCards();});
  $('#appsGrid').addEventListener('click', e => {const control=e.target.closest('[data-details]');if(control)openApp(control.dataset.details);});
  $('#dialogClose').addEventListener('click', () => $('#detailDialog').close());
  $('#detailDialog').addEventListener('click', e => {if (e.target === $('#detailDialog')) $('#detailDialog').close();});
  $('#menuBtn').addEventListener('click', () => {const open=$('#mainNav').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',String(open));});
  $$('.main-nav a').forEach(a=>a.addEventListener('click',()=>{$('#mainNav').classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false');}));
  document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement?.tagName!=='INPUT'&& !$('#detailDialog').open){e.preventDefault();$('#searchInput').focus();}});
  $('#year').textContent = new Date().getFullYear();
  applyTheme();applyLanguage();
  if (!apps.length) showToast(lang === 'ar' ? 'زيد التطبيقات فملف apps-data.js' : 'Add your apps in apps-data.js');
})();
