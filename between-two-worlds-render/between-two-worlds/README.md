# Between Two Worlds | بين عالمين

موقع ثابت (Static Site) بلا خادم ولا خطوة بناء.

## النشر على Render
1. ارفع مجلد المشروع إلى مستودع GitHub (أو GitLab).
2. في Render: New > Static Site، واختر المستودع.
3. Build Command: اتركه فارغًا. Publish Directory: `public`
   (أو استخدم ملف render.yaml عبر New > Blueprint).
4. بعد النشر يعمل الموقع على رابط onrender.com.

## ملاحظات
- مكتبة Three.js r128 تُحمَّل من cdnjs.cloudflare.com عند فتح الصفحة، فيحتاج المتصفح إلى إنترنت.
- حفظ الإعدادات يتم في localStorage للمتصفح فقط.
- نصوص العالم في الكائن OURS أول ملف public/app.js.
