# ECAB STOR × ShareNet — النشر على GitHub

هاد النسخة ديال الموقع كتعرض 5 تطبيقات: التطبيقات الثلاثة الأصلية (منهم Share Net with Proxy على Google Play) وزدنا ShareNet Client Android TV وShareNet Receiver Windows.

## 1) شنو اللي غادي ترفع؟

- **مستودع الموقع:** `ecab-stor` فيه ملفات الموقع الصغيرة، ومجلد `assets/` ديال الأيقونات. ممكن تنشره على GitHub Pages.
- **مستودع التحميل:** `share-net-clients` فيه Releases ديال تطبيق Android TV (.apk) وWindows (.exe). ما ترفعش مجلدات `build` ولا `gradle caches` فـGit العادي.
- ما تصيفطش Source Code حقيقي، keystore، passwords، QR payloads، ملفات `.env`، ولا مفاتيح سرية لمستودع عمومي.

## 2) ملفين ديال التنزيل (خاصهم يكونو مبنيين ومجربين)

سمّي ملفات التثبيت هكذا (يمكنك إعادة تسمية ملفات الإخراج قبل الرفع):

```
ShareNet-Client-Android-TV.apk
ShareNet-Receiver-Windows-Setup.exe
```

التطبيق المرسل Share Net with Proxy راه عندو Google Play فالموقع، ما محتاجش APK جديد من GitHub إلا بغيتي تنشر نسخة خاصة.

**Windows:** اختبر Installer الأخير حتى يتأكد Wi-Fi وUSB وQR وEasy Pair وVPN/TUN وموافقة Administrator. ما تنشرش Installer فيه `sing-box.exe` ناقص أو اتصال ما خدامش.

**Android TV:** يفضّل APK إصدار Release موقّع ومجرب، ماشي Debug APK مخصص للاختبار العمومي.

## 3) كيفاش ترفع ملفات التثبيت؟

1. دخل لـGitHub وأنشئ مستودع `share-net-clients`، Public إلى بغيتي تنزيل مفتوح.
2. دخل للمستودع → **Releases** → **Draft a new release**.
3. حدد Tag بحال `v1.0.0`، واكتب عنوان ووصف التحديث.
4. ضيف ملفات APK وEXE اللي فوق (بنفس الاسم بالضبط) و**Publish release**، ماشي Draft ولا Pre-release، إذا كنت غادي تستعمل `latest`.
5. في الموقع فتح `github-releases.js` وبدل:

```js
window.ECAB_GITHUB_RELEASES = {
  repository: "YOUR_USERNAME/share-net-clients"
};
```

إلى ما عمرتيش `repository`، أزرار تحميل Android TV وWindows غتبقى معطلة باش الموقع ما يعطيش روابط وهمية.

روابط التنزيل كيتحسبو تلقائياً:

```
https://github.com/YOUR_USERNAME/share-net-clients/releases/latest/download/ShareNet-Client-Android-TV.apk
https://github.com/YOUR_USERNAME/share-net-clients/releases/latest/download/ShareNet-Receiver-Windows-Setup.exe
```

قبل نشر الموقع، جرب الجوج روابط فنافذة خاصة بالمتصفح وتأكد ما كيعطيوش 404. الروابط كتخدم غير إلا كانت ملفات Release موجودة ومتاحة للعموم.

## 4) GitHub Pages

1. أنشئ مستودع `ecab-stor` وحط ملفات **داخل** مجلد `ecab-stor/` فجذر المستودع (ماشي المجلد الأب).
2. من Settings → Pages → Build and deployment: `Deploy from a branch` → `main` → `/(root)`.
3. URL غادي يكون غالباً `https://YOUR_USERNAME.github.io/ecab-stor/`.
4. إلا عملتي تغييرات فـ`studio.html` صدّر `apps-data.js` وبدّلو فمستودع الموقع.
5. `studio.html` محرّر محلي بلا login؛ يفضل ما تنشروش للعموم، إلا كنت عارف أنه غير أداة Local وليس Admin Panel محمي.

## 5) شنو تبدل فالموقع؟

- تمت إضافة بطاقتين بتصميم ECAB STOR وأيقوناتهما المستخرجة من التطبيقات ديالك.
- زر Android TV كيعرض APK، وزر Windows كيعرض EXE، وحاليا معطلين إلى ما تفعّل GitHub.
- تحديث `studio.html` باش Play Store وAPK/EXE يكونو روابط مستقلة بلا ما يضيع ربط Android TV فالتعديل.
- الموقع باقي عربي/إنجليزي، Dark/Light، والبحث والفلاتر ديالو كما كانوا.

## تنبيه

GitHub Pages كينشر صفحات الموقع، و**GitHub Releases** هو البلاصة المناسبة باش تستضيف ملفات APK/EXE. ZIP ديال هاد الموقع ما فيهش APK ولا EXE لأن البنايات النهائية خاصها تتخرج عندك من Windows/Android Studio وتتجرب.
