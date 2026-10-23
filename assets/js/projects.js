/* ==========================================================
   مصفوفة المشاريع
   لإضافة مشروع: انسخ القالب أدناه (بعد إزالة علامات التعليق) والصقه داخل المصفوفة.
   لا تعدّل HTML أو CSS: المعرض والتصفية ونافذة التفاصيل تُبنى تلقائيًا.

   {
     id: "project-1",                      // معرّف فريد (اختياري)
     name: "اسم المشروع",                  // مطلوب
     category: "صفحات هبوط",               // التصنيف: تُبنى منه أزرار التصفية تلقائيًا
     thumbnail: "assets/img/project-1.jpg",// صورة مصغرة (اختياري) — إن غابت يظهر بديل بسيط
     description: "وصف مختصر للمشروع.",
     problem: "المشكلة التي واجهها العميل.",   // اختياري
     solution: "الحل الذي نُفّذ.",             // اختياري
     technologies: ["HTML", "CSS", "JavaScript"],
     previewUrl: "https://example.com",    // رابط المعاينة (اختياري، يجب أن يبدأ بـ https://)
     status: "published"                   // published | inProgress | prototype
   }

   ملاحظة: أضف مشاريع حقيقية فقط وبروابط تعمل فعلًا.
   ========================================================== */
window.PROJECTS = [
  {
    id: "project-1",
    name: "بوصلة النمو",
    category: "صفحات هبوط",
    thumbnail: "assets/img/project-1.jpg",
    description: "موقع تسويقي للخبير حمدو الدلال لنظام نمو الحسابات على السوشال ميديا، يعرض نتائج العملاء وقصص النجاح وزر حجز مباشر.",
    problem: "الخبير يملك نتائج قوية لكنها مبعثرة، ويحتاج موقعاً يجمعها ويحوّل الزائر إلى حجز استشارة.",
    solution: "موقع عربي RTL يعرض شعارات العملاء الموثقين وأكثر من 500M مشاهدة وصور قبل وبعد وفيديوهات النجاح، مع ربط الحجز عبر Calendly.",
    technologies: ["HTML", "CSS", "JavaScript", "Calendly"],
    previewUrl: "https://bouslat-alnomow.com",
    status: "published"
  },
  {
    id: "project-2",
    name: "مرآة السعادة",
    category: "صفحات هبوط",
    thumbnail: "assets/img/project-2.jpg",
    description: "صفحة هبوط للايف كوتش أشواق شيخ الأرض لبرنامج «مرآة السعادة» لمتابعة 45 يوماً.",
    problem: "المدربة تحتاج صفحة تلامس مشاعر الزائرة وتبني الثقة بسرعة وتدفعها لحجز جلسة استكشافية.",
    solution: "صفحة بتسلسل مدروس من الألم إلى الحل ثم التعريف بالمدربة وآراء العميلات، مع أزرار حجز Calendly متكررة.",
    technologies: ["HTML", "CSS", "JavaScript", "Calendly"],
    previewUrl: "https://mirate-alsaada.com/",
    status: "published"
  },
  {
    id: "project-3",
    name: "استرداد مقام",
    category: "صفحات هبوط",
    thumbnail: "assets/img/project-3.jpg",
    description: "صفحة هبوط للأخصائية النفسية سماح القيسية لبرنامج علاجي لصدمات الطفولة والتعلّق، موجّه للنساء.",
    problem: "الفكرة العلاجية عميقة وتحتاج شرحاً بسيطاً وإنسانياً يوضح الفرق بين معالجة الجذور ومعالجة الأعراض.",
    solution: "سرد بصري يبدأ بالأنماط الثلاثة (خوف الرفض، النقد الداخلي، المنقذ)، ثم محاور البرنامج الأربعة وتجارب العميلات، وينتهي بحجز جلسة استكشافية.",
    technologies: ["HTML", "CSS", "JavaScript"],
    previewUrl: "https://estirdadalmaqam.com/",
    status: "published"
  },
  {
    id: "project-4",
    name: "تحدي الـ 30 يوماً للانتشار الفايرال",
    category: "صفحات هبوط",
    thumbnail: "assets/img/project-4.jpg",
    description: "صفحة بيع للمدرب حمدو الدلال لمنتج يضم 19 قالب سكربت فيروسي وخريطة ريلز للوصول إلى 40 مليون مشاهدة.",
    problem: "الصفحة تحتاج إقناع الزائر بمنتج رقمي بسعر 47$ ثم إتمام الدفع دون إخراجه من الصفحة.",
    solution: "صفحة RTL بتصميم أخضر وذهبي، وعدّاد متحرك، ومتتبع للـ 30 يوماً يُظهر نمو المتابعين، ودفع داخل نافذة منبثقة بدون فتح تبويب جديد.",
    technologies: ["HTML", "CSS", "JavaScript"],
    previewUrl: "https://viral-template.com",
    status: "published"
  },
  {
    id: "project-5",
    name: "اختبار الحدود العاطفية",
    category: "تطبيقات ويب",
    thumbnail: "assets/img/project-5.jpg",
    description: "اختبار تشخيصي عربي للكوتش نور مرضي بسعر 17$، من 9 أسئلة وينتهي بنتيجة من ثلاثة أنماط: المتمسكة أو المضحية أو المكبلة.",
    problem: "الكوتش تحتاج أداة تشخيص مدفوعة تجمع بيانات المشاركات وتعرض لكل واحدة نتيجتها دون إظهار الدرجات.",
    solution: "بدأ كنموذج أولي بواجهة أمامية فقط ثم تحوّل إلى تطبيق Django كامل: تسجيل، وتصحيح من جهة الخادم مع كسر التعادل، وصفحة نتيجة ديناميكية، ولوحة تحكم لعرض المشاركات، وربط الدفع عبر Stripe.",
    technologies: ["Django", "HTML", "CSS", "JavaScript", "Stripe"],
    previewUrl: "https://boundries.quiz.noormardi.com/",
    status: "published"
  },
  {
    id: "project-6",
    name: "اصنع فرصتك | أحمد المحمد",
    category: "مواقع شخصية",
    thumbnail: "assets/img/project-6.jpg",
    description: "موقع شخصي للكوتش المهني المعتمد من ICF ومدرب PMP أحمد المحمد، يعرض برنامج «اصنع فرصتك» للمدراء والموظفين والخريجين.",
    problem: "الكوتش يحتاج حضوراً احترافياً يعرّف بخبرته وفئاته المستهدفة ويسهّل الحجز.",
    solution: "موقع بسيط وواضح يعرض التحديات المهنية وبرنامج الكوتش ورحلته المهنية والأسئلة الشائعة، مع حجز مباشر عبر Calendly.",
    technologies: ["HTML", "CSS", "JavaScript", "Calendly"],
    previewUrl: "https://ahmedcoach.com/",
    status: "published"
  }
];
