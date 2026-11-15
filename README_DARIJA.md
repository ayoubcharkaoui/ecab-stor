# ECAB STOR — TV / Remote Control Mode v6

هاد تحديث ديال **الموقع فقط**، ما كيبدّل حتى تطبيق ولا روابط GitHub APK / EXE.

## الميزات
- وضع تلفاز مستقل وكبير (10-foot UI)، في حدود المساحة الآمنة لحواف الشاشة.
- دعم التخطيط فـ 960×540، 1280×720، 1920×1080، و4K browsers.
- التنقل بأسهم الريموت ↑ ↓ ← →، اختيار OK / Enter، ورجوع Back / Escape (إذا المتصفح كيرسل هاد المفاتيح للصفحة).
- التركيز ظاهر بخط أصفر/أخضر كبير حول البطاقة أو الزر المختار.
- الوصول للتطبيقات والفلاتر، البحث، تفاصيل التطبيق، وأزرار التحميل.
- القائمة الأصلية وألوان الموقع والعربية والإنجليزية وكود تحميل GitHub بقاو بلا تغيير.
- التفصيل كيتحل فنافذة ملائمة للتلفاز، وإغلاقها كيرجع التركيز للعنصر السابق.
- TV Mode تلقائي على عدد من متصفحات Android TV / Google TV / Smart TV، ويمكن تفعيلو من زر TV أو بالرابط `?tv=1`.
- زر TV كيخلّي المستخدم يرجع لواجهة PC العادية. الاختيار كيتحفظ فالمتصفح.

## شنو فالـZIP
- `assets/ecab-tv.css` — جميع قواعد الواجهة التلفزيونية.
- `assets/ecab-tv.js` — دعم الريموت والتنقل والأزرار.
- `index.html` — نسخة جاهزة للتحديث اليدوي فـGitHub (مبنية على موقعنا المنشور، فيها ربط الملفين).
- `INSTALL_TV_MODE.ps1` — طريقة أكثر أماناً للتحديث من PowerShell: كتحتفظ بأي تخصيصات موجودة فـindex.html، وكتضيف غير سطرين + الملفات.

## طريقة التركيب من Windows
حل PowerShell داخل المجلد اللي فيه `index.html`، ونفّذ:

```powershell
$zip = "$env:USERPROFILE\Downloads\ECAB-STOR-TV-Remote-v6-PATCH.zip"
$fix = "$env:TEMP\ECAB-STOR-TV-v6"
Expand-Archive -LiteralPath $zip -DestinationPath $fix -Force
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$fix\INSTALL_TV_MODE.ps1" -ProjectRoot (Get-Location).Path
```

من بعد تحدّث GitHub Repository `ayoubcharkaoui/ecab-stor`: `index.html` و `assets/ecab-tv.css` و `assets/ecab-tv.js`.

## مباشرة من GitHub فالهاتف
**بدون ما تستبدل index.html كامل** (هكذا كتحافظ على أي تعديل فيه):

1. فك ضغط ZIP.
2. فمجلد `assets` فـGitHub استعمل `Add file → Upload files` ورفع `ecab-tv.css` و `ecab-tv.js`، ثم Commit.
3. فتح `index.html` فـGitHub، ضغط على أيقونة القلم Edit.
4. قبل `</head>` زيد هاد السطرين:

```html
<link rel="stylesheet" href="assets/ecab-tv.css" />
<script src="assets/ecab-tv.js" defer></script>
```

5. Commit changes. GitHub Pages غادي يتحدّث تلقائياً.

**بديل سهل:** استبدل `index.html` بنسخة ZIP الجاهزة إذا متأكد أنه ما فيه حتى تخصيص أحدث من النسخة اللي سبق وجدناها.

## الاختبار
- افتح `https://ayoubcharkaoui.github.io/ecab-stor/?tv=1`
- جرّب الأسهم وOK، واختار تطبيق باش تفتح التفاصيل، وBack باش تسد.
- للتجربة على Android TV Emulator: حلّ هاد الرابط فمتصفح متوافق وجرّب الريموت.
- جرّب أيضاً الموقع من الهاتف عادي بلا `?tv=1` للتأكد أن واجهته ما تبدلاتش.

## قيود مهمة
- بعض متصفحات Smart TV كتمنع تنزيل APK/EXE أو كتستعمل مفاتيح Back للمتصفح نفسه؛ هادشي متعلق بالمتصفح/النظام، ماشي CSS.
- الملفات هنا فيها فقط الواجهة والتنقل؛ APK تثبيت التطبيقات فالتلفاز من المتصفح كيتوقف على الدعم والصلاحيات وسياسة الجهاز.
- اختبار الواجهة في Chromium آلياً داز بمقاسات 1920×1080 و1280×720 و960×540، والتنقل والأسهم والتفاصيل والفلاتر. ما تجرّبش على جهاز TV حقيقي داخل هاد البيئة، لذلك خاص اختبار أخير بالريموت.
