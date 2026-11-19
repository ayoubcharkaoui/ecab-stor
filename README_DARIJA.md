# ECAB STOR — Premium Experience v7

## مهم
هاد التحديث **Patch** ماشي الموقع كامل. فيه غير الملفات اللي تبدلات أو تزادت.

- **الدومين:** https://ecabstore.online/
- **GitHub Pages:** `ayoubcharkaoui/ecab-stor` / `main` / root
- **التطبيقات:** الاحتفاظ بملف `apps-data.js` الحالي كما هو، باش ما تضيعش التطبيقات الجديدة والوصف ديال v5.
- **روابط التحميل:** الاحتفاظ بملف `github-releases.js` وملفات APK وEXE فـGitHub Releases.
- **TV Mode:** الاحتفاظ بملفي `assets/ecab-tv.css` و`assets/ecab-tv.js` ديال v6.
- **الصور:** الاحتفاظ بمجلد `assets` وجميع الصور والخلفيات ديالو، بلا تغيير.
- **الدومين:** ما تحيدش `CNAME` فـGitHub، وما تبدلش DNS ولا إعدادات HTTPS.

## شنو تبدل فـv7؟

1. **هوية بصرية مضبوطة:** ألوان Navy + Teal + Lime منسجمة، بطاقات ومكونات موحدة، تصميم Light/Dark بتباين أحسن.
2. **ShareNet Spotlight:** قسم جديد كيوضح بالرسوم أن الهاتف المرسل كيشارك الإنترنت عبر Proxy، وAndroid/Windows كيتلقاو الاتصال عبر VPN/TUN محلي (ماشي VPN لتغيير البلد).
3. **بطاقات التطبيقات:** زر تحميل واضح بالنص، زر التفاصيل، شارات المنصة، ورسالة مناسبة إلا ما كانش رابط.
4. **سهولة الاستعمال:** تحسين البحث (حتى مع التشكيل العربي)، عدد النتائج، التحكم بالكيبورد، إغلاق القائمة، وعلامة التركيز.
5. **الهواتف والشاشات:** تعديلات Responsive من 320px حتى الشاشات الكبيرة مع الحفاظ على TV Mode.
6. **SEO:** Canonical للدومين الرسمي، metadata وWebSite structured data، `robots.txt` و`sitemap.xml`، وصفحة 404 خاصة.
7. **الأمان:** لا Backend ولا APIs جديدة، لا روابط وهمية، وكل روابط التحميل الرسمية بقات كما كانت.
8. **Studio:** نفس المحرّر المحلي، ولكن بتصميم متناسق ومنع فهرسته؛ ماشي لوحة تحكم محمية على الإنترنت.

## محتوى الـZIP

```text
INSTALL_WEBSITE_V7.ps1
README_DARIJA.md
Website/ecab-stor/
    index.html                   (معدل)
    app.js                       (معدل)
    studio.html                  (معدل)
    404.html                     (جديد)
    robots.txt                   (جديد)
    sitemap.xml                  (جديد)
    .nojekyll                    (جديد)
    assets/ecab-premium-v7.css  (جديد)
```

## التركيب من PowerShell

فتح PowerShell داخل مجلد الموقع اللي فيه `index.html`، ونفّذ:

```powershell
$zip = "$env:USERPROFILE\Downloads\ECAB-STOR-Premium-Experience-v7-PATCH.zip"
$fix = "$env:TEMP\ECAB-STOR-Premium-v7"
Expand-Archive -LiteralPath $zip -DestinationPath $fix -Force
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$fix\INSTALL_WEBSITE_V7.ps1" -ProjectRoot (Get-Location).Path
```

السكريبت كيحفظ Backup فـ`%TEMP%` خارج مجلد الموقع، باش ما ينشرش Backups بالغلط.

## نشر الموقع على GitHub Pages

### من الهاتف (GitHub Web)

داخل Repository `ayoubcharkaoui/ecab-stor`:
- عوّض الملفات اللي فالجذر: `index.html`, `app.js`, `studio.html` من داخل `Website/ecab-stor`.
- زيد `404.html`, `robots.txt`, `sitemap.xml` فالجذر.
- داخل `assets/` زيد `ecab-premium-v7.css`.
- ملف `.nojekyll` اختياري ويمكن رفعه كذلك.
- ما تعاودش ترفع ZIP: GitHub Pages خاصو ملفات مفكوكة.
- ما تبدلش `apps-data.js`, `github-releases.js`, `CNAME` ولا الملفات القديمة الأخرى.
- ملي تنشر، جرّب https://ecabstore.online/ و Ctrl+F5 أو تحديث الصفحة.

### من Windows باستعمال Git

أفضل طريقة هي تحدّث نسخة repository المحلية (`git clone` أول مرة أو `git pull` إلى كان موجود) ومن بعد تطبّق السكريبت داخل نفس المجلد ثم:

```powershell
git status
git add index.html app.js studio.html 404.html robots.txt sitemap.xml assets/ecab-premium-v7.css
git commit -m "Improve ECAB STOR experience v7"
git push origin main
```

إذا بغيت تضيف `.nojekyll` استعمل `git add .nojekyll` قبل commit.
**ما تستعملش `git add .` إلا كنت متأكد ما عندكش Backups أو ملفات شخصية داخل الموقع.**

## فحص قبل النشر

- صفحة الهاتف والكمبيوتر: البحث، Google Play، وتحميل APK/EXE.
- الفلاتر: All = 5, Phone = 4, TV = 1, Windows = 1 (إلا ما زدتش تطبيقات من بعد).
- تغيير اللغة AR/EN وLight/Dark.
- نافذة التفاصيل: فتح/إغلاق وصور التطبيقات.
- التلفاز: `https://ecabstore.online/?tv=1` مع الريموت (خصّ تجربة فعلية على المتصفح المستعمل فالتلفاز).
- HTTPS والدومين: ما خاصهم حتى تغيير.

**التحقق:** ملفات HTML/JS/CSS متفحوصة بنيوياً، وتم اختبار منطق الفلاتر والتحميل والبحث واللغة والثيم باستخدام Node DOM mock. المتصفح الحقيقي والـAndroid TV المادي ما تمّش التحقق منهم نهائياً داخل هاد البيئة.
