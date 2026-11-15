(() => {
'use strict';
const KEY='ecab-stor-studio-draft-v1';
const originals=JSON.parse(JSON.stringify(Array.isArray(window.ECAB_APPS)?window.ECAB_APPS:[]));
const $=q=>document.querySelector(q);
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validLink=v=>{try{const u=new URL(String(v||''));return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}};
const validMedia=v=>{const raw=String(v||'').trim();return /^assets\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|svg)$/i.test(raw)&&!raw.includes('..')?raw:validLink(raw)};
const deepCopy=v=>JSON.parse(JSON.stringify(v));
const lines=value=>String(value||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
const notify=msg=>{$('#studioStatus').textContent=msg;};
function getInitial(){
  try {
    const saved=JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved)) {
      const originalIds=new Set(originals.map(x=>x.id));
      return [...originals.map(x=>saved.find(y=>y?.id===x.id)||deepCopy(x)), ...saved.filter(y=>y&&typeof y.id==='string'&&!originalIds.has(y.id))];
    }
  }catch{}
  return deepCopy(originals);
}
let apps=getInitial();let currentId=apps[0]?.id||null;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(apps))}catch{notify('المتصفح ما قدرش يحفظ التعديلات؛ حمّل الملف دابا.')}}
function list(){
  $('#appCounter').textContent='('+apps.length+')';
  $('#appItems').innerHTML=apps.map(a=>`<button type="button" class="editor-item ${a.id===currentId?'active':''}" data-select="${safe(a.id)}"><img src="${safe(validMedia(a.icon)||'favicon.svg')}" alt="" onerror="this.src='favicon.svg'"/><span>${safe(a.name?.ar||a.name?.en||'New App')}</span><span>›</span></button>`).join('');
  $('#deleteApp').disabled=!currentId;
}
function f(name,value){const el=$('#appForm').elements.namedItem(name);if(el)el.value=value??'';}
function pick(id){
  currentId=id; const a=apps.find(x=>x.id===id);$('#appForm').reset();
  $('#formHeading').textContent=a?'تعديل: '+(a.name?.ar||a.name?.en):'تطبيق جديد';
  if(a){f('id',a.id);f('nameAr',a.name?.ar);f('nameEn',a.name?.en);f('taglineAr',a.tagline?.ar);f('taglineEn',a.tagline?.en);f('categoryAr',a.category?.ar);f('categoryEn',a.category?.en);f('descAr',a.description?.ar);f('descEn',a.description?.en);f('platform',a.platform);f('accent',a.accent);f('iconUrl',a.icon);f('shotUrls',(a.screenshots||[]).join('\n'));f('playUrl',a.playUrl);f('downloadUrl',a.downloadUrl);f('releaseAsset',a.releaseAsset);f('deviceType',a.platform==='windows'?'desktop':(Array.isArray(a.supportedDevices)&&a.supportedDevices.includes('phone')&&a.supportedDevices.includes('tv')?'both':a.deviceType || 'phone'));f('label',a.label);f('featuresAr',(a.features?.ar||[]).join('\n'));f('featuresEn',(a.features?.en||[]).join('\n'));$('#featured').checked=Boolean(a.featured);}
  else {f('id','');f('platform','android');f('deviceType','phone');f('accent','sage');}
  list();
}
$('#appItems').addEventListener('click',e=>{const btn=e.target.closest('[data-select]');if(btn)pick(btn.dataset.select)});
$('#newApp').addEventListener('click',()=>{pick(null);$('#nameAr').focus()});
$('#appForm').addEventListener('submit',e=>{
  e.preventDefault();const form=new FormData(e.currentTarget);const get=x=>String(form.get(x)||'').trim();
  const icon=get('iconUrl');const images=lines(get('shotUrls'));const play=get('playUrl');const link=get('downloadUrl');const releaseAsset=get('releaseAsset');
  if((icon&&!validMedia(icon))||images.some(x=>!validMedia(x))||(link&&!validLink(link))||(play&&!validLink(play))||(releaseAsset&&!/^[a-zA-Z0-9_.-]+\.(apk|exe|msi)$/i.test(releaseAsset))){notify('⚠ تأكد من الروابط، خاصها تبدأ بـ https:// أو http://');return;}
  const platform=get('platform')==='windows'?'windows':'android';
  const deviceChoice=get('deviceType');
  const supportedDevices=platform==='windows'?[]:(deviceChoice==='both'?['phone','tv']:[deviceChoice==='tv'?'tv':'phone']);
  const id=currentId||('ecab-app-'+Date.now());
  const existing=apps.find(a=>a.id===id)||{};
  const row={...existing,id,name:{ar:get('nameAr'),en:get('nameEn')},tagline:{ar:get('taglineAr'),en:get('taglineEn')},description:{ar:get('descAr'),en:get('descEn')},category:{ar:get('categoryAr')||'أدوات',en:get('categoryEn')||'Utilities'},platform,deviceType:platform==='windows'?'desktop':(deviceChoice==='both'?'tv':supportedDevices[0]),supportedDevices,playUrl:platform==='android'?play:'',downloadUrl:link,releaseAsset,icon,screenshots:images.slice(0,8),features:{ar:lines(get('featuresAr')),en:lines(get('featuresEn'))},accent:get('accent'),featured:$('#featured').checked,label:get('label') || (platform==='android'?'ANDROID':'WINDOWS')};
  const index=apps.findIndex(a=>a.id===id);if(index>=0)apps[index]=row;else apps.push(row);
  currentId=id;persist();pick(id);notify('✓ تحفظ محلياً. حمّل apps-data.js وعوّض الملف القديم باش تنشر التغييرات.');
});
$('#deleteApp').addEventListener('click',()=>{if(!currentId)return;const a=apps.find(x=>x.id===currentId);if(!confirm('واش متأكد بغيتي تحيد '+(a?.name?.ar||'هاد التطبيق')+'؟'))return;apps=apps.filter(x=>x.id!==currentId);persist();pick(apps[0]?.id||null);notify('تحيّد التطبيق من المسودة المحلية.')});
$('#resetLocal').addEventListener('click',()=>{if(!confirm('غادي ترجع التطبيقات الأصلية وتحيد التعديلات المحلية. نكملو؟'))return;apps=deepCopy(originals);persist();pick(apps[0]?.id||null);notify('رجعنا للملف الأصلي.')});
function download(text,name,mime){const blob=new Blob([text],{type:mime});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),1000)}
$('#exportJs').addEventListener('click',()=>{download('/** ECAB STOR app catalog — generated by local editor. */\nwindow.ECAB_APPS = '+JSON.stringify(apps,null,2)+';\n','apps-data.js','text/javascript;charset=utf-8');notify('✓ الملف تحمّل. عوّض به apps-data.js اللي فالموقع.')});
$('#exportJson').addEventListener('click',()=>{download(JSON.stringify(apps,null,2),'ecab-stor-backup.json','application/json');notify('✓ تحمّلت النسخة الاحتياطية.')});
$('#importJson').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data)||data.some(x=>!x||typeof x.id!=='string'||!x.name||!['android','windows'].includes(x.platform)))throw Error('invalid');apps=data;persist();pick(apps[0]?.id||null);notify('✓ استوردنا النسخة الاحتياطية.')}catch{notify('⚠ ملف JSON ماشي بصيغة ECAB STOR الصحيحة.')}finally{e.target.value=''}});
pick(currentId);
})();
