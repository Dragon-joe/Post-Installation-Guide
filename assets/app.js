(() => {
'use strict';

const D = window.GUIDE_DATA || { apps: [], packages: {}, steps: [], videos: [], compareGroups: [] };
const APPS = D.apps || [];
const visibleApps = APPS.filter(a => !a.comparisonOnly);
const byId = Object.fromEntries(APPS.map(a => [a.id, a]));

const keys = {
  theme: 'post-guide-theme',
  lang: 'post-guide-lang',
  installed: 'post-guide-installed-v2',
  favorites: 'post-guide-favorites-v2',
  pkg: 'post-guide-package-v2',
  steps: 'post-guide-steps-v2'
};

const getSet = k => {
  try { return new Set(JSON.parse(localStorage.getItem(k) || '[]')); }
  catch { return new Set(); }
};
const saveSet = (k, s) => localStorage.setItem(k, JSON.stringify([...s]));
const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
const norm = s => String(s || '').toLocaleLowerCase().trim();

let lang = localStorage.getItem(keys.lang) || document.documentElement.lang || 'ar';
if (!['ar', 'en'].includes(lang)) lang = 'ar';

const T = {
  ar: {
    siteName: 'دليل ما بعد التثبيت',
    siteTagline: 'جهّز ويندوز بثقة',
    skip: 'تجاوز إلى المحتوى',
    menu: 'فتح القائمة',
    home: 'الرئيسية',
    steps: 'خطوات التجهيز',
    compare: 'المقارنة',
    favorites: 'المفضلة',
    videos: 'الفيديوهات',
    about: 'حول',
    privacy: 'الخصوصية',
    report: 'الإبلاغ عن رابط',
    sitemap: 'خريطة الموقع',
    footerCopy: 'دليل تفاعلي لاختيار البرامج وتجهيز ويندوز دون تثبيت أشياء لا تحتاجها.',
    lightMode: 'الوضع النهاري',
    darkMode: 'الوضع الليلي',
    backTop: 'العودة إلى أعلى الصفحة',
    addFav: 'إضافة إلى المفضلة',
    removeFav: 'إزالة من المفضلة',
    addedFav: 'تمت الإضافة إلى المفضلة',
    removedFav: 'تمت الإزالة من المفضلة',
    copyWinget: 'نسخ أمر WinGet',
    copiedWinget: 'تم نسخ أمر WinGet',
    installed: 'تم التثبيت',
    markInstalled: 'علّم كمثبت',
    installedCount: 'مثبت',
    packageItems: 'داخل الباقة',
    packageDone: 'اكتملت الباقة. جهازك جاهز حسب الاختيارات الحالية.',
    packageProgress: pct => `تم تجهيز الجهاز بنسبة ${pct}%.`,
    recommendedPrograms: n => `${n} برنامجًا مقترحًا`,
    allPrograms: n => `${n} برنامجًا وأداة`,
    showAll: 'عرض الكل',
    packageLabel: 'الباقة',
    foundResults: n => `تم العثور على ${n} برنامجًا`,
    noResultsTitle: 'لا توجد نتائج مطابقة.',
    noResultsBody: 'جرّب مسح الفلاتر أو اختيار باقة أخرى.',
    favoriteEmptyTitle: 'المفضلة فارغة',
    favoriteEmptyBody: 'احفظ البرامج التي تريد الرجوع إليها لاحقًا.',
    browsePrograms: 'استعراض البرامج',
    details: 'التفاصيل',
    officialSite: 'الموقع الرسمي ↗',
    pricing: 'السعر والترخيص',
    size: 'حجم التحميل',
    os: 'أنظمة التشغيل',
    classification: 'التصنيف',
    advantages: 'المميزات',
    disadvantages: 'العيوب',
    alternatives: 'بدائل البرنامج',
    unavailable: 'غير متاح',
    appNotFound: 'البرنامج غير موجود',
    backGuide: 'العودة للدليل',
    comparePrompt2: 'اختر برنامجًا',
    comparePrompt3: 'برنامج ثالث اختياري',
    compareAtLeast: 'اختر برنامجين على الأقل.',
    yes: 'نعم',
    no: 'لا',
    criterion: 'المعيار',
    description: 'الوصف',
    openSource: 'مفتوح المصدر',
    winget: 'أمر WinGet',
    complete: 'مكتملة',
    markComplete: 'تحديد كمكتملة',
    of: 'من',
    openAction: 'فتح الإجراء المناسب ←',
    noVideos: 'لا توجد نتائج.',
    reportReady: 'تم تجهيز نص البلاغ',
    reportCopied: 'تم نسخ البلاغ',
    reportPlaceholder: 'سيظهر نص البلاغ هنا.',
    reportNone: 'لا توجد',
    warning: 'تنبيه',
    typeLabels: { essential: 'أساسي', optional: 'اختياري', dev: 'متقدم' },
    priceOptions: { all: 'كل الأسعار', free: 'مجاني', opensource: 'مفتوح المصدر', paid: 'مدفوع' },
    typeOptions: { all: 'كل الأنواع', essential: 'أساسي', optional: 'اختياري', dev: 'متقدم / مطور' },
    sortOptions: { priority: 'الأكثر أهمية', name: 'الاسم', free: 'المجاني أولًا', opensource: 'المفتوح المصدر أولًا', newest: 'الأحدث إضافة' },
    videoLabels: { all: 'الكل', performance: 'الأداء', cleanup: 'التنظيف', startup: 'بدء التشغيل', gaming: 'الألعاب' },
    reportTypes: ['الرابط لا يعمل', 'الرابط غير رسمي', 'المعلومات قديمة', 'مشكلة أخرى'],
    compareFields: [['الوصف', 'description'], ['السعر والترخيص', 'pricing'], ['الحجم', 'size'], ['النظام', 'os'], ['مفتوح المصدر', 'openSource'], ['أمر WinGet', 'winget']]
  },
  en: {
    siteName: 'Post-Installation Guide',
    siteTagline: 'Set up Windows with confidence',
    skip: 'Skip to content',
    menu: 'Open menu',
    home: 'Home',
    steps: 'Setup Steps',
    compare: 'Compare',
    favorites: 'Favorites',
    videos: 'Videos',
    about: 'About',
    privacy: 'Privacy',
    report: 'Report a link',
    sitemap: 'Sitemap',
    footerCopy: 'An interactive guide for choosing software and setting up Windows without installing things you do not need.',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    backTop: 'Back to top',
    addFav: 'Add to favorites',
    removeFav: 'Remove from favorites',
    addedFav: 'Added to favorites',
    removedFav: 'Removed from favorites',
    copyWinget: 'Copy WinGet command',
    copiedWinget: 'WinGet command copied',
    installed: 'Installed',
    markInstalled: 'Mark as installed',
    installedCount: 'installed',
    packageItems: 'in package',
    packageDone: 'Package completed. Your device is ready based on the current selection.',
    packageProgress: pct => `Your setup is ${pct}% complete.`,
    recommendedPrograms: n => `${n} recommended apps`,
    allPrograms: n => `${n} apps & tools`,
    showAll: 'Show all',
    packageLabel: 'Package',
    foundResults: n => `${n} apps found`,
    noResultsTitle: 'No matching results.',
    noResultsBody: 'Try clearing the filters or choosing another package.',
    favoriteEmptyTitle: 'Favorites list is empty',
    favoriteEmptyBody: 'Save the apps you want to revisit later.',
    browsePrograms: 'Browse apps',
    details: 'Details',
    officialSite: 'Official site ↗',
    pricing: 'Pricing & license',
    size: 'Download size',
    os: 'Supported operating systems',
    classification: 'Category',
    advantages: 'Pros',
    disadvantages: 'Cons',
    alternatives: 'Alternatives',
    unavailable: 'Not available',
    appNotFound: 'App not found',
    backGuide: 'Back to guide',
    comparePrompt2: 'Choose an app',
    comparePrompt3: 'Optional third app',
    compareAtLeast: 'Choose at least two apps.',
    yes: 'Yes',
    no: 'No',
    criterion: 'Criteria',
    description: 'Description',
    openSource: 'Open source',
    winget: 'WinGet command',
    complete: 'Completed',
    markComplete: 'Mark as complete',
    of: 'of',
    openAction: 'Open related action →',
    noVideos: 'No results.',
    reportReady: 'Report text generated',
    reportCopied: 'Report copied',
    reportPlaceholder: 'The report text will appear here.',
    reportNone: 'None',
    warning: 'Warning',
    typeLabels: { essential: 'Essential', optional: 'Optional', dev: 'Advanced' },
    priceOptions: { all: 'All prices', free: 'Free', opensource: 'Open source', paid: 'Paid' },
    typeOptions: { all: 'All types', essential: 'Essential', optional: 'Optional', dev: 'Advanced / Developer' },
    sortOptions: { priority: 'Most important', name: 'Name', free: 'Free first', opensource: 'Open source first', newest: 'Newest first' },
    videoLabels: { all: 'All', performance: 'Performance', cleanup: 'Cleanup', startup: 'Startup', gaming: 'Gaming' },
    reportTypes: ['Broken link', 'Unofficial link', 'Outdated information', 'Other issue'],
    compareFields: [['Description', 'description'], ['Pricing & license', 'pricing'], ['Size', 'size'], ['OS', 'os'], ['Open source', 'openSource'], ['WinGet command', 'winget']]
  }
};

const PACKAGE_META = {
  general: { ar: 'استخدام عادي', en: 'General Use', icon: iconHome() },
  gaming: { ar: 'ألعاب', en: 'Gaming', icon: iconGamepad() },
  developer: { ar: 'برمجة', en: 'Development', icon: iconCode() },
  creator: { ar: 'تصميم ومونتاج', en: 'Design & Editing', icon: iconSparkles() },
  lowend: { ar: 'جهاز ضعيف', en: 'Low-End PC', icon: iconBolt() },
  student: { ar: 'طالب', en: 'Student', icon: iconBook() },
  all: { ar: 'عرض الكل', en: 'Show All', icon: iconGrid() }
};

const badgeMap = {
  'الأفضل لمعظم المستخدمين': 'Best for most users',
  'أخف برنامج': 'Lightweight',
  'مفتوح المصدر': 'Open source',
  'مناسب للأجهزة الضعيفة': 'Good for low-end PCs',
  'مدفوع أو باشتراك': 'Paid / Subscription',
  'مجاني': 'Free',
  'خفيف': 'Lightweight',
  'للمستخدم المتقدم': 'For advanced users'
};

const textMap = new Map([
  ['مجاني', 'Free'],
  ['مجاني ومفتوح المصدر', 'Free & open source'],
  ['مدفوع أو باشتراك', 'Paid / Subscription'],
  ['Windows 10 وWindows 11', 'Windows 10 and Windows 11'],
  ['يتغير حسب الإصدار وطريقة التثبيت', 'Varies by version and installation method'],
  ['نحو 35 MB', 'About 35 MB'],
  ['ينفذ وظيفته الأساسية بوضوح', 'It does its core job clearly.'],
  ['يتوفر من مصدر رسمي أو مستودع موثوق', 'Available from an official source or trusted repository.'],
  ['قد لا تحتاجه إذا كان لديك بديل مناسب', 'You may not need it if you already have a suitable alternative.'],
  ['راجع خيارات التثبيت والصلاحيات قبل المتابعة', 'Review installation options and permissions before continuing.'],
  ['راجع البرامج المشابهة داخل نفس القسم', 'See similar apps in the same section.'],
  ['توجد مزايا أو تراخيص مدفوعة؛ راجع الخطة قبل الشراء.', 'Some features or licenses are paid; review the plan before purchasing.'],
  ['يحتاج خبرة عند إنهاء العمليات أو تعديل الخدمات والصلاحيات.', 'Needs experience when ending processes or modifying services and permissions.'],
  ['توفر النسخة المجانية وسياسة الترخيص قد يتغيران؛ راجع الموقع الرسمي.', 'Free availability and licensing can change; check the official website.'],
  ['قد يغيّر إعدادات النظام أو الشبكة أو الإقلاع.', 'May change system, network, or boot settings.'],
  ['اختيار وحدة تخزين خاطئة قد يمسح بياناتها بالكامل.', 'Choosing the wrong drive can erase its data completely.'],
  ['لا تجمع أكثر من برنامج حماية يعمل لحظيًا دون حاجة.', 'Do not run more than one real-time antivirus tool unless necessary.'],
  ['اختبر إمكانية استعادة النسخة بدل الاعتماد على وجودها فقط.', 'Test the restore process instead of only assuming the backup is enough.'],
  ['لا تطبق سكربتات تحسين مجهولة أو تعديلات لا تعرف أثرها.', 'Do not apply unknown tweak scripts or changes you do not understand.']
]);

function currentT() { return T[lang]; }
function t(key, ...args) {
  const value = currentT()[key];
  return typeof value === 'function' ? value(...args) : value;
}
function typeLabel(type) { return currentT().typeLabels[type] || (lang === 'ar' ? 'أداة' : 'Tool'); }
function packageName(id) { return (PACKAGE_META[id] || {})[lang] || D.packages[id] || id; }
function appCategory(app) { return lang === 'en' ? (app.category || app.categoryAr) : (app.categoryAr || app.category); }
function appDescription(app) { return lang === 'en' ? (app.descriptionEn || app.description) : app.description; }
function localizeText(value) {
  if (lang === 'ar') return value;
  if (!value) return value;
  return textMap.get(value) || value
    .replace(/^نحو /, 'About ')
    .replace(/^حوالي /, 'About ')
    .replace(/Windows 10 وWindows 11/g, 'Windows 10 and Windows 11');
}
function pricingText(app) { return lang === 'en' ? (app.pricingEn || localizeText(app.pricing)) : app.pricing; }
function sizeText(app) { return lang === 'en' ? (app.sizeEn || localizeText(app.size)) : app.size; }
function osText(app) { return lang === 'en' ? (app.osEn || localizeText(app.os)) : app.os; }
function warningsText(app) { return lang === 'en' ? (app.warningsEn || (app.warnings || []).map(localizeText)) : (app.warnings || []); }
function prosText(app) { return lang === 'en' ? (app.prosEn || (app.pros || []).map(localizeText)) : (app.pros || []); }
function consText(app) { return lang === 'en' ? (app.consEn || (app.cons || []).map(localizeText)) : (app.cons || []); }
function alternativesText(app) { return lang === 'en' ? (app.alternativesEn || (app.alternatives || []).map(localizeText)) : (app.alternatives || []); }
function badgeText(b, app) { if (lang === 'ar') return b; const list = app?.badges || []; const idx = list.indexOf(b); return app?.badgesEn?.[idx] || badgeMap[b] || localizeText(b); }
function toast(msg) {
  const el = document.querySelector('[data-toast]');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2200);
}

function iconWrap(svg) { return `<span class="package-icon">${svg}</span>`; }
function iconHome() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-5h5v5"/></svg>'; }
function iconGamepad() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9h10a4 4 0 0 1 3.8 5.3l-.8 2.5A2.5 2.5 0 0 1 15.2 18l-2.3-2H11l-2.3 2A2.5 2.5 0 0 1 4 16.8l-.8-2.5A4 4 0 0 1 7 9Z"/><path d="M8 12v4M6 14h4M16.5 13.5h.01M18.5 15.5h.01"/></svg>'; }
function iconCode() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14.5 5-5 14"/></svg>'; }
function iconSparkles() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z"/><path d="M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/><path d="M6 14l.9 2.1L9 17l-2.1.9L6 20l-.9-2.1L3 17l2.1-.9L6 14Z"/></svg>'; }
function iconBolt() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 6 13h5l-1 9 8-12h-5l0-8Z"/></svg>'; }
function iconBook() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>'; }
function iconGrid() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>'; }


const UI_ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-5h5v5"/>',
  steps: '<path d="M8 6h11M8 12h11M8 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>',
  compare: '<path d="M8 4h12M8 10h8M8 16h12"/><path d="m4 3-2 2 2 2M4 13l-2 2 2 2"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
  heartFill: '<path fill="currentColor" stroke="none" d="M12 21 4.2 13.5 3.1 12.4a5.5 5.5 0 0 1 7.8-7.8L12 5.7l1.1-1.1a5.5 5.5 0 0 1 7.8 7.8l-1.1 1.1L12 21Z"/>',
  video: '<rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 10 4-2v8l-4-2Z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  shield: '<path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  report: '<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/><path d="M16.5 3v4"/>',
  sitemap: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M5 17v-3h14v3M12 12v5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  clear: '<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
  arrowUp: '<path d="m6 11 6-6 6 6M12 5v14"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6H5V6h6"/>',
  copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  details: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  price: '<path d="M4 7h16v11H4z"/><path d="M4 10h16M8 15h2"/>',
  size: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v5h5M10 13h6M10 17h4"/>',
  monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  tag: '<path d="M3 12V4h8l10 10-7 7L3 12Z"/><circle cx="7.5" cy="8.5" r="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  alternatives: '<path d="M7 7h11l-3-3M18 7l-3 3M17 17H6l3 3M6 17l3-3"/>',
  warning: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
  archive: '<rect x="4" y="5" width="16" height="4" rx="1"/><path d="M6 9v10h12V9M10 13h4"/>',
  browser: '<circle cx="12" cy="12" r="9"/><path d="M3 10h18M8 3.8c2 2.3 3 5 3 8.2s-1 5.9-3 8.2M16 3.8c-2 2.3-3 5-3 8.2s1 5.9 3 8.2"/>',
  usb: '<path d="M12 3v14M12 3l-2 2M12 3l2 2M12 10l5-3M17 7h2v2h-2zM12 14l-5-3M5 9h4v4H5z"/><circle cx="12" cy="19" r="2"/>',
  media: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3Z"/>',
  package: '<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.2-1.2"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  apps: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  moon: '<path d="M21 12.8A8.4 8.4 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  refresh: '<path d="M20 6v5h-5M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6 6.5L4 9M5.5 15A7 7 0 0 0 18 17.5l2-2.5"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3M9 10h6v4H9z"/>',
  backup: '<path d="M7 18a5 5 0 0 1 .4-10A7 7 0 0 1 20 11.5 3.5 3.5 0 0 1 18.5 18H7Z"/><path d="M12 10v7M9 13l3-3 3 3"/>',
  speed: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="m12 13 4-4M7 18h10"/>',
  filter: '<path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z"/>',
  sort: '<path d="M8 6h10M8 12h7M8 18h4M4 4v16M2 18l2 2 2-2"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>'
};
function uiIcon(name, extra = '') {
  return `<svg class="ui-icon ${extra}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${UI_ICONS[name] || UI_ICONS.info}</svg>`;
}
function iconText(name, label) { return `${uiIcon(name)}<span>${label}</span>`; }
function favoriteContent(active, detail = false) {
  const icon = uiIcon(active ? 'heartFill' : 'heart');
  if (!detail) return icon;
  const label = active ? (lang === 'ar' ? 'محفوظ' : 'Saved') : (lang === 'ar' ? 'حفظ في المفضلة' : 'Save to favorites');
  return `${icon}<span>${label}</span>`;
}
function stepIcon(id) {
  return uiIcon({ updates: 'refresh', drivers: 'chip', security: 'shield', apps: 'apps', backup: 'backup', optimize: 'speed' }[id] || 'steps');
}
function compareIcon(id) { return uiIcon({ archives: 'archive', browsers: 'browser', media: 'media', usb: 'usb' }[id] || 'compare'); }

function setLangState() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dataset.lang = lang;
}

function setupShell() {
  setLangState();
  document.querySelectorAll('[data-year]').forEach(e => e.textContent = new Date().getFullYear());

  const page = document.body?.dataset.page;
  document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.nav === page));

  const navActions = document.querySelector('.nav-actions');
  if (navActions && !navActions.querySelector('[data-lang-toggle]')) {
    const langBtn = document.createElement('button');
    langBtn.type = 'button';
    langBtn.className = 'icon-btn lang-toggle';
    langBtn.dataset.langToggle = '';
    navActions.insertBefore(langBtn, navActions.firstChild);
  }

  const mt = document.querySelector('[data-menu-toggle]');
  const syncMenu = open => {
    if (!mt) return;
    mt.innerHTML = uiIcon(open ? 'close' : 'menu');
    mt.setAttribute('aria-expanded', String(open));
  };
  syncMenu(false);
  mt?.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    syncMenu(open);
  });

  const root = document.documentElement;
  let theme = localStorage.getItem(keys.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.dataset.theme = theme;

  const themeSvg = mode => uiIcon(mode === 'dark' ? 'sun' : 'moon');
  const syncTheme = () => {
    const isDark = root.dataset.theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(b => {
      b.innerHTML = themeSvg(isDark ? 'dark' : 'light');
      b.title = isDark ? t('lightMode') : t('darkMode');
      b.setAttribute('aria-label', b.title);
      b.setAttribute('aria-pressed', String(isDark));
    });
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = isDark ? '#0b1220' : '#0b57d0';
  };
  syncTheme();

  document.querySelectorAll('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(keys.theme, root.dataset.theme);
    syncTheme();
  }));

  document.querySelectorAll('[data-lang-toggle]').forEach(b => {
    b.textContent = lang === 'ar' ? 'EN' : 'AR';
    b.title = lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';
    b.setAttribute('aria-label', b.title);
    b.addEventListener('click', () => {
      localStorage.setItem(keys.lang, lang === 'ar' ? 'en' : 'ar');
      location.reload();
    });
  });

  const back = document.querySelector('[data-back-top]');
  const bar = document.querySelector('[data-reading-progress]');
  const scroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    back?.classList.toggle('show', y > 500);
    if (bar) bar.style.width = `${max > 0 ? Math.min(100, y / max * 100) : 0}%`;
  };
  addEventListener('scroll', scroll, { passive: true });
  scroll();
  back?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  localizeShellStatic();
  updateFavoriteCount();
}

function localizeShellStatic() {
  const tt = currentT();
  const page = document.body?.dataset.page || 'home';
  const titles = {
    home: lang === 'ar' ? 'دليل ما بعد تثبيت ويندوز' : 'Windows Post-Installation Guide',
    app: lang === 'ar' ? 'تفاصيل البرنامج | دليل ما بعد التثبيت' : 'App Details | Post-Installation Guide',
    favorites: lang === 'ar' ? 'المفضلة | دليل ما بعد التثبيت' : 'Favorites | Post-Installation Guide',
    compare: lang === 'ar' ? 'مقارنة البرامج | دليل ما بعد التثبيت' : 'Compare Apps | Post-Installation Guide',
    steps: lang === 'ar' ? 'خطوات ما بعد تثبيت ويندوز' : 'Windows Post-Installation Steps',
    videos: lang === 'ar' ? 'فيديوهات تحسين ويندوز' : 'Windows Optimization Videos',
    about: lang === 'ar' ? 'حول الموقع | دليل ما بعد التثبيت' : 'About | Post-Installation Guide',
    privacy: lang === 'ar' ? 'سياسة الخصوصية | دليل ما بعد التثبيت' : 'Privacy Policy | Post-Installation Guide',
    report: lang === 'ar' ? 'الإبلاغ عن رابط | دليل ما بعد التثبيت' : 'Report a Link | Post-Installation Guide',
    sitemap: lang === 'ar' ? 'خريطة الموقع | دليل ما بعد التثبيت' : 'Sitemap | Post-Installation Guide'
  };
  document.title = titles[page] || titles.home;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && lang === 'en') meta.content = 'An interactive guide for choosing Windows applications, tracking setup progress, comparing alternatives, and saving favorites locally.';
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.content = lang === 'ar' ? 'ar_AR' : 'en_US';
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = document.title;
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && meta) ogDesc.content = meta.content;
  const brandText = document.querySelectorAll('.brand-text');
  brandText.forEach((el, i) => {
    const small = i === 0 ? `<small>${tt.siteTagline}</small>` : '';
    el.innerHTML = `${tt.siteName}${small}`;
  });
  const skip = document.querySelector('.skip-link');
  if (skip) skip.textContent = tt.skip;
  const navMeta = [
    [tt.home, 'home'], [tt.steps, 'steps'], [tt.compare, 'compare'], [tt.favorites, 'heart'], [tt.videos, 'video'], [tt.about, 'info']
  ];
  document.querySelectorAll('.nav-link').forEach((a, i) => {
    const count = a.querySelector('.nav-count');
    const countHTML = count ? `<span class="nav-count" data-favorite-count>${count.textContent || '0'}</span>` : '';
    const [label, icon] = navMeta[i] || [a.textContent, 'info'];
    a.innerHTML = `${uiIcon(icon)}<span>${label}</span>${countHTML}`;
  });
  const primaryNav = document.querySelector('.nav-links');
  if (primaryNav) primaryNav.setAttribute('aria-label', lang === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation');
  const brand = document.querySelector('.site-header .brand');
  if (brand) brand.setAttribute('aria-label', lang === 'ar' ? 'دليل ما بعد التثبيت - الرئيسية' : 'Post-Installation Guide - Home');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  if (menuToggle) menuToggle.setAttribute('aria-label', tt.menu);
  const back = document.querySelector('[data-back-top]');
  if (back) { back.setAttribute('aria-label', tt.backTop); back.innerHTML = uiIcon('arrowUp'); }
  const footerCopy = document.querySelector('.footer-copy');
  if (footerCopy) footerCopy.textContent = tt.footerCopy;
  const footerLinks = document.querySelectorAll('.footer-links a');
  if (footerLinks[0]) footerLinks[0].innerHTML = iconText('shield', tt.privacy);
  if (footerLinks[1]) footerLinks[1].innerHTML = iconText('report', tt.report);
  if (footerLinks[2]) footerLinks[2].innerHTML = iconText('sitemap', tt.sitemap);
  applyStaticPageText();
  decorateStaticIcons();
}

function qsAll(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function setText(sel, value, root = document) { const el = root.querySelector(sel); if (el) el.textContent = value; }

function applyStaticPageText() {
  const page = document.body?.dataset.page;
  const tt = currentT();
  const heroes = qsAll('.page-hero h1');
  const paragraphs = qsAll('.page-hero p');

  if (page === 'home') {
    setText('.eyebrow', lang === 'ar' ? 'دليل عملي، لا قائمة روابط فقط' : 'A practical guide, not just a list of links');
    setText('.hero h1', lang === 'ar' ? 'جهّز ويندوز خطوة بخطوة، واحفظ تقدمك تلقائيًا.' : 'Set up Windows step by step and save your progress automatically.');
    setText('.hero-copy', lang === 'ar' ? 'اختر نوع استخدامك، علّم البرامج التي ثبّتها، وانسخ أوامر WinGet للبرامج المدعومة. بياناتك تبقى داخل متصفحك ولا تُرسل إلى خادم.' : 'Choose your usage type, mark the apps you have installed, and copy WinGet commands for supported apps. Your data stays in your browser and is not sent to a server.');
    const heroButtons = qsAll('.hero-actions .btn');
    if (heroButtons[0]) heroButtons[0].innerHTML = iconText('package', lang === 'ar' ? 'اختر باقتك' : 'Choose your package');
    if (heroButtons[1]) heroButtons[1].innerHTML = iconText('steps', lang === 'ar' ? 'ابدأ بالخطوات الست' : 'Start with the six steps');
    setText('.progress-head span', lang === 'ar' ? 'تقدم التجهيز' : 'Setup progress');
    const stats = qsAll('.mini-stats span');
    if (stats[0]) stats[0].innerHTML = `<strong data-installed-count>0</strong> ${tt.installedCount}`;
    if (stats[1]) stats[1].innerHTML = `<strong data-package-total>0</strong> ${tt.packageItems}`;
    const sectionHeads = qsAll('.section-heading');
    if (sectionHeads[0]) {
      setText('.kicker', lang === 'ar' ? 'باقات جاهزة' : 'Ready-made packages', sectionHeads[0]);
      setText('h2', lang === 'ar' ? 'اختر استخدامك الأساسي' : 'Choose your main use', sectionHeads[0]);
      setText('p', lang === 'ar' ? 'الباقة لا تثبّت شيئًا تلقائيًا؛ هي فقط تعرض البرامج الأكثر صلة وتحتسب تقدمك بناءً عليها.' : 'A package does not install anything automatically; it only shows the most relevant apps and calculates your progress accordingly.', sectionHeads[0]);
    }
    if (sectionHeads[1]) {
      setText('.kicker', lang === 'ar' ? 'الترتيب الصحيح' : 'Correct order', sectionHeads[1]);
      setText('h2', lang === 'ar' ? 'قبل تثبيت البرامج' : 'Before installing apps', sectionHeads[1]);
      const link = sectionHeads[1].querySelector('.text-link');
      if (link) link.innerHTML = iconText('steps', lang === 'ar' ? 'عرض كل الخطوات' : 'View all steps');
    }
    if (sectionHeads[2]) {
      setText('.kicker', lang === 'ar' ? 'البرامج والأدوات' : 'Apps and tools', sectionHeads[2]);
      setText('h2', lang === 'ar' ? 'اختيارات واضحة بدل الحيرة' : 'Clear choices instead of guesswork', sectionHeads[2]);
      setText('p', lang === 'ar' ? 'كل وصف مترجم، وكل عنصر يوضح السعر والترخيص والاختيار الأنسب والتحذيرات المهمة.' : 'Each item shows pricing, licensing, best-fit badges, and important warnings.', sectionHeads[2]);
    }
    const clearFilters = document.getElementById('clear-filters');
    if (clearFilters) clearFilters.innerHTML = iconText('clear', lang === 'ar' ? 'مسح البحث والفلاتر' : 'Clear search & filters');
    const progressCard = document.querySelector('.progress-card');
    if (progressCard) progressCard.setAttribute('aria-label', lang === 'ar' ? 'تقدم تجهيز الجهاز' : 'Device setup progress');
    const search = document.getElementById('app-search');
    if (search) search.placeholder = lang === 'ar' ? 'ابحث باسم البرنامج أو وظيفته...' : 'Search by app name or purpose...';
    const type = document.getElementById('type-filter');
    if (type) type.innerHTML = `<option value="all">${tt.typeOptions.all}</option><option value="essential">${tt.typeOptions.essential}</option><option value="optional">${tt.typeOptions.optional}</option><option value="dev">${tt.typeOptions.dev}</option>`;
    const price = document.getElementById('price-filter');
    if (price) price.innerHTML = `<option value="all">${tt.priceOptions.all}</option><option value="free">${tt.priceOptions.free}</option><option value="opensource">${tt.priceOptions.opensource}</option><option value="paid">${tt.priceOptions.paid}</option>`;
    const sort = document.getElementById('sort-filter');
    if (sort) sort.innerHTML = `<option value="priority">${tt.sortOptions.priority}</option><option value="name">${tt.sortOptions.name}</option><option value="free">${tt.sortOptions.free}</option><option value="opensource">${tt.sortOptions.opensource}</option><option value="newest">${tt.sortOptions.newest}</option>`;
    if (type) type.setAttribute('aria-label', lang === 'ar' ? 'نوع البرنامج' : 'App type');
    if (price) price.setAttribute('aria-label', lang === 'ar' ? 'السعر' : 'Price');
    if (sort) sort.setAttribute('aria-label', lang === 'ar' ? 'الترتيب' : 'Sort order');
  }

  if (page === 'favorites') {
    const kicker = document.querySelector('.page-hero .kicker');
    if (kicker) kicker.textContent = lang === 'ar' ? 'قائمتك الخاصة' : 'Your personal list';
    if (heroes[0]) heroes[0].textContent = lang === 'ar' ? 'البرامج المحفوظة في المفضلة' : 'Saved favorites';
    if (paragraphs[0]) paragraphs[0].textContent = lang === 'ar' ? 'تُحفظ القائمة داخل هذا المتصفح فقط.' : 'This list is saved in this browser only.';
  }

  if (page === 'compare') {
    const kicker = document.querySelector('.page-hero .kicker');
    if (kicker) kicker.textContent = lang === 'ar' ? 'اختيار مبني على احتياجك' : 'Choose based on your needs';
    if (heroes[0]) heroes[0].textContent = lang === 'ar' ? 'قارن البرامج قبل التثبيت' : 'Compare apps before installing';
    if (paragraphs[0]) paragraphs[0].textContent = lang === 'ar' ? 'ابدأ بمقارنة جاهزة أو اختر حتى ثلاثة برامج يدويًا.' : 'Start with a ready-made comparison or choose up to three apps manually.';
    const runCompare = document.getElementById('run-compare');
    if (runCompare) runCompare.innerHTML = iconText('compare', lang === 'ar' ? 'عرض المقارنة' : 'Show comparison');
  }

  if (page === 'steps') {
    const kicker = document.querySelector('.page-hero .kicker');
    if (kicker) kicker.textContent = lang === 'ar' ? 'من البداية للنهاية' : 'From start to finish';
    if (heroes[0]) heroes[0].textContent = lang === 'ar' ? 'ست خطوات لإعداد ويندوز بشكل صحيح' : 'Six steps to set up Windows properly';
    if (paragraphs[0]) paragraphs[0].textContent = lang === 'ar' ? 'علّم كل خطوة عند الانتهاء. تقدم الخطوات محفوظ داخل المتصفح.' : 'Mark each step when done. Step progress is saved in your browser.';
  }

  if (page === 'videos') {
    const kicker = document.querySelector('.page-hero .kicker');
    if (kicker) kicker.textContent = lang === 'ar' ? 'شروحات مرئية' : 'Video guides';
    if (heroes[0]) heroes[0].textContent = lang === 'ar' ? 'فيديوهات تحسين ويندوز' : 'Windows optimization videos';
    if (paragraphs[0]) paragraphs[0].textContent = lang === 'ar' ? 'المشغل لا يُحمّل إلا بعد الضغط للحفاظ على سرعة الصفحة.' : 'The player loads only after you click, to keep the page fast.';
    const search = document.getElementById('video-search');
    if (search) search.placeholder = lang === 'ar' ? 'ابحث في عنوان الفيديو...' : 'Search video titles...';
    qsAll('[data-video-filter]').forEach(btn => { btn.textContent = tt.videoLabels[btn.dataset.videoFilter] || btn.textContent; });
    const close = document.querySelector('[data-dialog-close]');
    if (close) close.setAttribute('aria-label', lang === 'ar' ? 'إغلاق مشغل الفيديو' : 'Close video player');
  }

  if (page === 'about') {
    const kicker = document.querySelector('.page-hero .kicker');
    if (kicker) kicker.textContent = lang === 'ar' ? 'لماذا هذا الموقع؟' : 'Why this website?';
    if (heroes[0]) heroes[0].textContent = lang === 'ar' ? 'لأن تثبيت كل برنامج تجده ليس إعدادًا صحيحًا.' : 'Installing every app you find is not a proper setup.';
    if (paragraphs[0]) paragraphs[0].textContent = lang === 'ar' ? 'الموقع يرشح الأدوات حسب الاستخدام، يوضح البدائل والتحذيرات، ويترك القرار للمستخدم.' : 'The site recommends tools by use case, shows alternatives and warnings, and leaves the decision to the user.';
    const h2 = qsAll('.info-card h2');
    const p = qsAll('.info-card p');
    if (lang === 'en') {
      if (h2[0]) h2[0].textContent = 'What does it offer?';
      if (p[0]) p[0].textContent = 'Usage packages, an interactive setup checklist, local progress and favorites storage, detail pages, comparisons, WinGet commands, and ordered post-installation steps.';
      if (h2[1]) h2[1].textContent = 'How are links handled?';
      if (p[1]) p[1].textContent = 'Priority goes to the official website or the project repository. There is a report form for broken links and a periodic checking script inside the tools folder.';
      if (h2[2]) h2[2].textContent = 'Where is my data stored?';
      if (p[2]) p[2].textContent = 'App states, favorites, language, and theme are stored in localStorage inside your browser. The project has no server or tracking system.';
      if (h2[3]) h2[3].textContent = 'Important note';
      if (p[3]) p[3].textContent = 'Privacy tools and system-debloating apps can cause issues if used without understanding the settings. Create a backup before major changes.';
    }
  }

  if (page === 'privacy') {
    if (heroes[0]) heroes[0].textContent = lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy policy';
    if (paragraphs[0]) paragraphs[0].textContent = lang === 'ar' ? 'نسخة مناسبة للمشروع الثابت الحالي.' : 'A version suitable for the current static project.';
    const h2 = qsAll('.prose h2');
    const p = qsAll('.prose p');
    if (lang === 'en') {
      if (h2[0]) h2[0].textContent = 'Local data';
      if (p[0]) p[0].textContent = 'The site stores the theme, language, favorites, installed-state flags, and step progress in your browser using localStorage. This data is not sent to a server.';
      if (h2[1]) h2[1].textContent = 'External links';
      if (p[1]) p[1].textContent = 'When you open an app website or a YouTube video, the privacy policy of that external service applies.';
      if (h2[2]) h2[2].textContent = 'Cookies and analytics';
      if (p[2]) p[2].textContent = 'The current project does not add advertising cookies or analytics tools. If you add analytics after publishing, update this page and display an appropriate notice.';
      if (h2[3]) h2[3].textContent = 'Delete data';
      if (p[3]) p[3].textContent = 'You can delete site data from your browser settings.';
      if (p[4]) p[4].textContent = 'Last updated: 19 July 2026.';
    }
  }

  if (page === 'sitemap') {
    const kicker = document.querySelector('.page-hero .kicker');
    if (kicker) kicker.textContent = lang === 'ar' ? 'وصول مباشر لكل المحتوى' : 'Direct access to all content';
    if (heroes[0]) heroes[0].textContent = lang === 'ar' ? 'خريطة الموقع' : 'Sitemap';
    if (paragraphs[0]) paragraphs[0].textContent = lang === 'ar' ? 'تصفح الصفحات الأساسية والباقات وكل البرامج من مكان واحد.' : 'Browse main pages, usage packages, and every app from one place.';
    const sections = qsAll('.section-heading');
    if (sections[0]) {
      setText('.kicker', lang === 'ar' ? 'الصفحات الأساسية' : 'Main pages', sections[0]);
      setText('h2', lang === 'ar' ? 'كل أقسام الموقع' : 'All site sections', sections[0]);
    }
    if (sections[1]) {
      setText('.kicker', lang === 'ar' ? 'باقات الاستخدام' : 'Usage packages', sections[1]);
      setText('h2', lang === 'ar' ? 'الوصول السريع للباقات' : 'Quick access to packages', sections[1]);
    }
    if (sections[2]) {
      setText('.kicker', lang === 'ar' ? 'فهرس البرامج' : 'App index', sections[2]);
      setText('h2', lang === 'ar' ? 'كل البرامج حسب القسم' : 'All apps by category', sections[2]);
      setText('p', lang === 'ar' ? 'افتح أي قسم ثم انتقل مباشرة إلى صفحة تفاصيل البرنامج.' : 'Open a category and go directly to any app details page.', sections[2]);
    }
  }

  if (page === 'report') {
    if (heroes[0]) heroes[0].textContent = lang === 'ar' ? 'الإبلاغ عن رابط لا يعمل' : 'Report a broken link';
    if (paragraphs[0]) paragraphs[0].textContent = lang === 'ar' ? 'المشروع ثابت ولا يملك خادمًا؛ النموذج ينشئ رسالة جاهزة يمكنك نسخها أو إرسالها بالبريد بعد وضع عنوان التواصل.' : 'This is a static project with no server. The form creates a ready-made message that you can copy or email after adding a contact address.';
    const labels = qsAll('.report-form label');
    if (labels[0]) labels[0].childNodes[0].textContent = lang === 'ar' ? 'اسم البرنامج' : 'App name';
    if (labels[1]) labels[1].childNodes[0].textContent = lang === 'ar' ? 'الرابط الذي به مشكلة' : 'Problematic link';
    if (labels[2]) labels[2].childNodes[0].textContent = lang === 'ar' ? 'نوع المشكلة' : 'Issue type';
    if (labels[3]) labels[3].childNodes[0].textContent = lang === 'ar' ? 'تفاصيل إضافية' : 'Additional details';
    const type = document.getElementById('report-type');
    if (type) type.innerHTML = currentT().reportTypes.map(x => `<option>${x}</option>`).join('');
    const buttons = qsAll('.form-actions .btn');
    if (buttons[0]) buttons[0].innerHTML = iconText('report', lang === 'ar' ? 'تجهيز البلاغ' : 'Generate report');
    if (buttons[1]) buttons[1].innerHTML = iconText('copy', lang === 'ar' ? 'نسخ البلاغ' : 'Copy report');
    const out = document.getElementById('report-output');
    if (out && !out.textContent.trim()) out.textContent = tt.reportPlaceholder;
  }
}


function decorateStaticIcons() {
  document.querySelectorAll('.search > span').forEach(el => { el.innerHTML = uiIcon('search'); });
  const selectIcons = { 'type-filter': 'filter', 'price-filter': 'price', 'sort-filter': 'sort', 'compare-one': 'apps', 'compare-two': 'apps', 'compare-three': 'apps' };
  Object.entries(selectIcons).forEach(([id, icon]) => {
    const select = document.getElementById(id);
    if (!select || select.parentElement?.classList.contains('select-control')) return;
    const wrap = document.createElement('label');
    wrap.className = 'select-control';
    wrap.innerHTML = uiIcon(icon);
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
  });
  const page = document.body?.dataset.page;
  const heroIconMap = { favorites: 'heart', compare: 'compare', steps: 'steps', videos: 'video', about: 'info', privacy: 'shield', report: 'report', sitemap: 'sitemap' };
  const heroBox = document.querySelector('.page-hero .container');
  if (heroBox && heroIconMap[page] && !heroBox.querySelector('.page-hero-icon')) {
    heroBox.insertAdjacentHTML('afterbegin', `<span class="page-hero-icon">${uiIcon(heroIconMap[page])}</span>`);
  }
  if (page === 'about') {
    const icons = ['apps', 'link', 'database', 'warning'];
    document.querySelectorAll('.info-card').forEach((card, i) => {
      if (!card.querySelector('.info-card-icon')) card.insertAdjacentHTML('afterbegin', `<span class="info-card-icon">${uiIcon(icons[i] || 'info')}</span>`);
    });
  }
  if (page === 'privacy') {
    const icons = ['database', 'external', 'shield', 'clear'];
    document.querySelectorAll('.prose h2').forEach((h, i) => {
      if (!h.querySelector('.ui-icon')) h.innerHTML = `${uiIcon(icons[i] || 'shield')}<span>${esc(h.textContent)}</span>`;
    });
  }
  if (page === 'report') {
    const icons = ['apps', 'link', 'report', 'info'];
    document.querySelectorAll('.report-form label').forEach((label, i) => {
      if (label.querySelector('.field-label')) return;
      const control = label.querySelector('input,select,textarea');
      const labelText = [...label.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim();
      label.childNodes.forEach(n => { if (n.nodeType === Node.TEXT_NODE) n.remove(); });
      label.insertAdjacentHTML('afterbegin', `<span class="field-label">${uiIcon(icons[i] || 'info')}<span>${esc(labelText)}</span></span>`);
      if (control && control.parentElement !== label) label.appendChild(control);
    });
  }
  document.querySelectorAll('.filter-pills [data-video-filter]').forEach(btn => {
    if (btn.querySelector('.ui-icon')) return;
    const map = { all: 'apps', performance: 'speed', cleanup: 'clear', startup: 'refresh', gaming: 'gamepad' };
    const icon = map[btn.dataset.videoFilter] === 'gamepad' ? iconGamepad() : uiIcon(map[btn.dataset.videoFilter] || 'video');
    btn.innerHTML = `${icon}<span>${esc(btn.textContent)}</span>`;
  });
  const close = document.querySelector('[data-dialog-close]');
  if (close) close.innerHTML = uiIcon('close');
}

function updateFavoriteCount() {
  const n = getSet(keys.favorites).size;
  document.querySelectorAll('[data-favorite-count]').forEach(e => e.textContent = n);
}

function logo(app, large = false) {
  const initial = esc(app.name.charAt(0));
  const src = `icons/apps/${encodeURIComponent(app.id)}.svg`;
  return `<span class="app-logo-wrap ${large ? 'large' : ''}"><span class="app-logo-fallback">${initial}</span><img class="app-logo" src="${src}" alt="" loading="lazy" onerror="this.hidden=true"></span>`;
}

function badges(app) {
  return (app.badges || []).map((b, i) => `<span class="badge ${i === 0 ? 'primary' : ''}">${esc(badgeText(b, app))}</span>`).join('');
}

function wingetButton(app) {
  if (!app.winget) return '';
  const cmd = `winget install --id ${app.winget} -e --accept-package-agreements --accept-source-agreements`;
  return `<button class="btn btn-command" type="button" data-copy-command="${esc(cmd)}">${iconText('copy', t('copyWinget'))}</button>`;
}

function warningHtml(app) {
  return warningsText(app).map(w => `<div class="warning">${uiIcon('warning')}<div><strong>${t('warning')}:</strong> ${esc(w)}</div></div>`).join('');
}

function card(app, installed, favorites) {
  const isI = installed.has(app.id);
  const isF = favorites.has(app.id);
  return `<article class="app-card" data-id="${esc(app.id)}">
    <div class="card-top">${logo(app)}<div class="app-title"><span class="meta">${uiIcon('tag')}${esc(appCategory(app))} · ${typeLabel(app.type)}</span><h3>${esc(app.name)}</h3></div><button class="favorite-btn ${isF ? 'active' : ''}" data-favorite="${esc(app.id)}" aria-label="${isF ? t('removeFav') : t('addFav')}">${favoriteContent(isF)}</button></div>
    <div class="badges">${badges(app)}</div><p>${esc(appDescription(app))}</p>${warningHtml(app)}
    <div class="card-facts"><span>${uiIcon('price')}${esc(pricingText(app))}</span><span>${uiIcon('size')}${esc(sizeText(app))}</span></div>
    <div class="card-actions"><label class="installed-toggle"><input type="checkbox" data-installed="${esc(app.id)}" ${isI ? 'checked' : ''}><span>${isI ? t('installed') : t('markInstalled')}</span></label><a class="btn btn-small" href="app.html?id=${encodeURIComponent(app.id)}">${iconText('details', t('details'))}</a>${wingetButton(app)}</div></article>`;
}

function bindCards(root, onChange) {
  root.querySelectorAll('[data-favorite]').forEach(b => b.addEventListener('click', () => {
    const s = getSet(keys.favorites);
    const id = b.dataset.favorite;
    s.has(id) ? s.delete(id) : s.add(id);
    saveSet(keys.favorites, s);
    updateFavoriteCount();
    const active = s.has(id);
    b.classList.toggle('active', active);
    b.innerHTML = favoriteContent(active, b.hasAttribute('data-favorite-detail'));
    b.setAttribute('aria-label', active ? t('removeFav') : t('addFav'));
    toast(s.has(id) ? t('addedFav') : t('removedFav'));
    onChange?.();
  }));

  root.querySelectorAll('[data-installed]').forEach(c => c.addEventListener('change', () => {
    const s = getSet(keys.installed);
    const id = c.dataset.installed;
    c.checked ? s.add(id) : s.delete(id);
    saveSet(keys.installed, s);
    c.nextElementSibling.textContent = c.checked ? t('installed') : t('markInstalled');
    onChange?.();
  }));

  root.querySelectorAll('[data-copy-command]').forEach(b => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copyCommand);
      toast(t('copiedWinget'));
    } catch {
      prompt(lang === 'ar' ? 'انسخ الأمر:' : 'Copy the command:', b.dataset.copyCommand);
    }
  }));
}

function currentPackage() { return new URLSearchParams(location.search).get('package') || localStorage.getItem(keys.pkg) || 'general'; }
function packageApps(pkg) { return visibleApps.filter(a => pkg === 'all' || a.packages.includes(pkg)); }

function updateProgress(pkg) {
  const installed = getSet(keys.installed);
  const list = packageApps(pkg);
  const done = list.filter(a => installed.has(a.id)).length;
  const pct = list.length ? Math.round(done / list.length * 100) : 0;
  document.querySelector('[data-progress-percent]')?.replaceChildren(`${pct}%`);
  const bar = document.querySelector('[data-progress-bar]');
  if (bar) bar.style.width = `${pct}%`;
  document.querySelector('[data-progress-text]')?.replaceChildren(pct === 100 ? t('packageDone') : t('packageProgress', pct));
  document.querySelector('[data-installed-count]')?.replaceChildren(done);
  document.querySelector('[data-package-total]')?.replaceChildren(list.length);
}

function renderPackageCard(id, active) {
  const count = id === 'all' ? visibleApps.length : packageApps(id).length;
  const icon = `<span class="package-icon"><img src="icons/packages/${id}.svg" alt="" width="52" height="52"></span>`;
  return `<button class="package-card ${active ? 'active' : ''}" data-package="${id}" aria-pressed="${active}">${icon}<strong>${esc(packageName(id))}</strong><small>${id === 'all' ? t('allPrograms', count) : t('recommendedPrograms', count)}</small></button>`;
}

function renderHome() {
  const pkgBox = document.getElementById('package-selector');
  const grid = document.getElementById('app-grid');
  if (!grid) return;

  let pkg = currentPackage(), type = 'all', price = 'all', sort = 'priority';
  const search = document.getElementById('app-search');

  const renderPackages = () => {
    pkgBox.innerHTML = Object.keys(D.packages).map(id => renderPackageCard(id, pkg === id)).join('') + renderPackageCard('all', pkg === 'all');
    pkgBox.querySelectorAll('[data-package]').forEach(b => b.addEventListener('click', () => {
      pkg = b.dataset.package;
      localStorage.setItem(keys.pkg, pkg);
      renderPackages();
      render();
      scrollTo({ top: document.getElementById('programs').offsetTop - 90, behavior: 'smooth' });
    }));
  };

  const stepsPreview = document.getElementById('steps-preview');
  if (stepsPreview) stepsPreview.innerHTML = D.steps.slice(0, 6).map(s => `<a class="step-mini" href="steps.html#${s.id}"><span class="step-mini-icon">${stepIcon(s.id)}</span><strong>${esc(lang === 'en' ? (s.titleEn || localizeText(s.title)) : s.title)}</strong><small>${s.order}</small></a>`).join('');

  const render = () => {
    let list = packageApps(pkg);
    const term = norm(search.value);
    list = list.filter(a => (type === 'all' || a.type === type) &&
      (price === 'all' || (price === 'free' && !a.pricing.includes('مدفوع')) || (price === 'opensource' && a.openSource) || (price === 'paid' && a.pricing.includes('مدفوع'))) &&
      (!term || norm(`${a.name} ${appDescription(a)} ${a.category} ${a.categoryAr}`).includes(term)));

    list.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name, 'en') : sort === 'free' ? (a.pricing.includes('مدفوع') ? 1 : 0) - (b.pricing.includes('مدفوع') ? 1 : 0) : sort === 'opensource' ? Number(b.openSource) - Number(a.openSource) : sort === 'newest' ? b.added.localeCompare(a.added) : b.priority - a.priority);

    const installed = getSet(keys.installed);
    const favorites = getSet(keys.favorites);
    grid.innerHTML = list.length ? list.map(a => card(a, installed, favorites)).join('') : `<div class="empty-state">${uiIcon('search')}<strong>${t('noResultsTitle')}</strong><p>${t('noResultsBody')}</p></div>`;
    document.getElementById('results-count').innerHTML = iconText('list', t('foundResults', list.length));
    document.getElementById('active-package-label').innerHTML = iconText('package', `${t('packageLabel')}: ${pkg === 'all' ? packageName('all') : packageName(pkg)}`);
    bindCards(grid, () => updateProgress(pkg));
    updateProgress(pkg);
  };

  renderPackages();
  document.getElementById('type-filter').addEventListener('change', e => { type = e.target.value; render(); });
  document.getElementById('price-filter').addEventListener('change', e => { price = e.target.value; render(); });
  document.getElementById('sort-filter').addEventListener('change', e => { sort = e.target.value; render(); });
  search.addEventListener('input', render);
  document.getElementById('clear-filters').addEventListener('click', () => {
    search.value = '';
    type = price = 'all';
    sort = 'priority';
    document.getElementById('type-filter').value = 'all';
    document.getElementById('price-filter').value = 'all';
    document.getElementById('sort-filter').value = 'priority';
    render();
  });
  const q = new URLSearchParams(location.search).get('search');
  if (q) { search.value = q; render(); } else render();
}

function renderDetail() {
  const el = document.getElementById('app-detail');
  if (!el) return;
  const app = byId[new URLSearchParams(location.search).get('id')];
  if (!app) {
    el.innerHTML = `<div class="empty-state">${uiIcon('warning')}<h1>${t('appNotFound')}</h1><a class="btn btn-primary" href="index.html">${iconText('home', t('backGuide'))}</a></div>`;
    return;
  }
  document.title = `${app.name} | ${t('siteName')}`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = appDescription(app);
  const canonical = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = `https://your-domain.com/app.html?id=${encodeURIComponent(app.id)}`;
  if (canonical) canonical.href = canonicalUrl;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = document.title;
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = appDescription(app);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.content = canonicalUrl;

  const installed = getSet(keys.installed), fav = getSet(keys.favorites);
  el.innerHTML = `<nav class="breadcrumbs"><a href="index.html">${iconText('home', t('home'))}</a><span>${uiIcon('arrow')}</span><span>${esc(app.name)}</span></nav>
    <article class="detail-card"><header class="detail-header">${logo(app, true)}<div><span class="kicker">${uiIcon('tag')}${esc(appCategory(app))}</span><h1>${esc(app.name)}</h1><div class="badges">${badges(app)}</div></div></header>
    <p class="lead">${esc(appDescription(app))}</p>${warningHtml(app)}
    <div class="detail-actions"><label class="installed-toggle"><input type="checkbox" data-installed="${app.id}" ${installed.has(app.id) ? 'checked' : ''}><span>${installed.has(app.id) ? t('installed') : t('markInstalled')}</span></label><button class="btn btn-muted favorite-btn ${fav.has(app.id) ? 'active' : ''}" data-favorite="${app.id}" data-favorite-detail>${favoriteContent(fav.has(app.id), true)}</button>${wingetButton(app)}${app.official ? `<a class="btn btn-primary" href="${esc(app.official)}" target="_blank" rel="noopener">${iconText('external', t('officialSite').replace(' ↗',''))}</a>` : ''}</div>
    <div class="facts-grid"><div>${uiIcon('price')}<span>${t('pricing')}</span><strong>${esc(pricingText(app))}</strong></div><div>${uiIcon('size')}<span>${t('size')}</span><strong>${esc(sizeText(app))}</strong></div><div>${uiIcon('monitor')}<span>${t('os')}</span><strong>${esc(osText(app))}</strong></div><div>${uiIcon('tag')}<span>${t('classification')}</span><strong>${typeLabel(app.type)}</strong></div></div>
    <div class="pros-cons"><section><h2>${iconText('plus', t('advantages'))}</h2><ul>${prosText(app).map(x => `<li>${esc(x)}</li>`).join('')}</ul></section><section><h2>${iconText('minus', t('disadvantages'))}</h2><ul>${consText(app).map(x => `<li>${esc(x)}</li>`).join('')}</ul></section></div>
    <section class="alternatives"><h2>${iconText('alternatives', t('alternatives'))}</h2><div>${alternativesText(app).map(x => `<span class="badge">${uiIcon('apps')}${esc(x)}</span>`).join('')}</div></section></article>`;
  bindCards(el);
}

function renderFavorites() {
  const grid = document.getElementById('favorites-grid');
  if (!grid) return;
  const render = () => {
    const fav = getSet(keys.favorites), installed = getSet(keys.installed), list = visibleApps.filter(a => fav.has(a.id));
    grid.innerHTML = list.length ? list.map(a => card(a, installed, fav)).join('') : `<div class="empty-state">${uiIcon('heart')}<h2>${t('favoriteEmptyTitle')}</h2><p>${t('favoriteEmptyBody')}</p><a class="btn btn-primary" href="index.html#programs">${iconText('apps', t('browsePrograms'))}</a></div>`;
    bindCards(grid, render);
  };
  render();
}

function renderCompare() {
  const presets = document.getElementById('compare-presets');
  if (!presets) return;
  const opts = APPS.map(a => `<option value="${a.id}">${esc(a.name)}</option>`).join('');
  ['compare-one', 'compare-two', 'compare-three'].forEach((id, i) => {
    document.getElementById(id).innerHTML = `<option value="">${i === 2 ? t('comparePrompt3') : t('comparePrompt2')}</option>${opts}`;
  });

  const show = ids => {
    const list = ids.map(id => byId[id]).filter(Boolean);
    if (list.length < 2) {
      document.getElementById('compare-result').innerHTML = `<div class="empty-state">${uiIcon('compare')}<p>${t('compareAtLeast')}</p></div>`;
      return;
    }
    document.getElementById('compare-result').innerHTML = `<table class="compare-table"><thead><tr><th>${t('criterion')}</th>${list.map(a => `<th>${logo(a)}<strong>${esc(a.name)}</strong></th>`).join('')}</tr></thead><tbody>${currentT().compareFields.map(([label, key]) => `<tr><th>${label}</th>${list.map(a => `<td>${key === 'openSource' ? (a[key] ? t('yes') : t('no')) : esc(key === 'description' ? appDescription(a) : key === 'pricing' ? pricingText(a) : key === 'size' ? sizeText(a) : key === 'os' ? osText(a) : a[key] || t('unavailable'))}</td>`).join('')}</tr>`).join('')}<tr><th>${t('advantages')}</th>${list.map(a => `<td><ul>${prosText(a).map(x => `<li>${esc(x)}</li>`).join('')}</ul></td>`).join('')}</tr><tr><th>${t('disadvantages')}</th>${list.map(a => `<td><ul>${consText(a).map(x => `<li>${esc(x)}</li>`).join('')}</ul></td>`).join('')}</tr></tbody></table>`;
  };

  presets.innerHTML = D.compareGroups.map(g => `<button class="chip" data-compare-preset="${g.id}">${compareIcon(g.id)}<span>${esc(lang === 'en' ? (g.titleEn || localizeText(g.title)) : g.title)}</span></button>`).join('');
  presets.querySelectorAll('[data-compare-preset]').forEach(b => b.addEventListener('click', () => {
    const g = D.compareGroups.find(x => x.id === b.dataset.comparePreset);
    g.apps.forEach((id, i) => { const s = document.getElementById(['compare-one', 'compare-two', 'compare-three'][i]); if (s) s.value = id; });
    show(g.apps);
  }));
  document.getElementById('run-compare').addEventListener('click', () => show(['compare-one', 'compare-two', 'compare-three'].map(id => document.getElementById(id).value)));
  const first = D.compareGroups[0];
  if (first) { first.apps.forEach((id, i) => document.getElementById(['compare-one', 'compare-two', 'compare-three'][i]).value = id); show(first.apps); }
}

function renderSteps() {
  const list = document.getElementById('steps-list');
  if (!list) return;
  const done = getSet(keys.steps);
  const update = () => {
    const n = done.size;
    const b = document.querySelector('[data-steps-progress]');
    if (b) b.style.width = `${Math.round(n / D.steps.length * 100)}%`;
    const label = document.querySelector('[data-steps-label]');
    if (label) label.textContent = `${n} ${t('of')} ${D.steps.length}`;
  };
  list.innerHTML = D.steps.map(s => `<article class="timeline-item ${done.has(s.id) ? 'done' : ''}" id="${s.id}"><div class="timeline-number">${s.order}</div><div><div class="timeline-head"><span class="step-icon">${stepIcon(s.id)}</span><h2>${esc(lang === 'en' ? (s.titleEn || localizeText(s.title)) : s.title)}</h2><label class="installed-toggle"><input type="checkbox" data-step="${s.id}" ${done.has(s.id) ? 'checked' : ''}><span>${done.has(s.id) ? t('complete') : t('markComplete')}</span></label></div><p>${esc(lang === 'en' ? (s.descriptionEn || localizeText(s.description)) : s.description)}</p>${s.warning ? `<div class="warning">${uiIcon('warning')}<div><strong>${t('warning')}:</strong> ${esc(lang === 'en' ? (s.warningEn || localizeText(s.warning)) : s.warning)}</div></div>` : ''}<a class="text-link" href="${esc(s.action)}">${iconText('external', t('openAction').replace(/[←→]/g, '').trim())}</a></div></article>`).join('');
  list.querySelectorAll('[data-step]').forEach(c => c.addEventListener('change', () => {
    c.checked ? done.add(c.dataset.step) : done.delete(c.dataset.step);
    saveSet(keys.steps, done);
    c.closest('.timeline-item').classList.toggle('done', c.checked);
    c.nextElementSibling.textContent = c.checked ? t('complete') : t('markComplete');
    update();
  }));
  update();
}

function renderVideos() {
  const grid = document.getElementById('video-grid'), search = document.getElementById('video-search');
  if (!grid) return;
  let filter = 'all';
  const labels = currentT().videoLabels;
  const dialog = document.getElementById('video-dialog'), frame = document.getElementById('video-frame');

  const render = () => {
    const q = norm(search.value);
    const list = D.videos.filter(v => (filter === 'all' || v.category === filter) && (!q || norm(v.title).includes(q)));
    grid.innerHTML = list.map(v => {
      const id = v.embed.split('/').pop().split('?')[0];
      return `<article class="video-card"><button class="video-thumb" data-video="${esc(v.embed)}" data-title="${esc(v.title)}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span>${uiIcon('play')}</span></button><div><span class="badge">${uiIcon('video')}${labels[v.category]}</span><h3>${esc(v.title)}</h3></div></article>`;
    }).join('') || `<div class="empty-state">${uiIcon('video')}<p>${t('noVideos')}</p></div>`;
    grid.querySelectorAll('[data-video]').forEach(b => b.addEventListener('click', () => {
      document.getElementById('video-dialog-title').textContent = b.dataset.title;
      frame.innerHTML = `<iframe src="${b.dataset.video}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      dialog.showModal();
    }));
  };

  document.querySelectorAll('[data-video-filter]').forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.videoFilter;
    document.querySelectorAll('[data-video-filter]').forEach(x => x.classList.toggle('active', x === b));
    render();
  }));
  search.addEventListener('input', render);
  document.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () => frame.innerHTML = '');
  render();
}


function renderSitemap() {
  const pagesBox = document.getElementById('sitemap-pages');
  const packagesBox = document.getElementById('sitemap-packages');
  const appsBox = document.getElementById('sitemap-apps');
  if (!pagesBox || !packagesBox || !appsBox) return;
  const pages = [
    ['index.html', 'home', lang === 'ar' ? 'الرئيسية' : 'Home', lang === 'ar' ? 'الباقات والبحث وقائمة البرامج.' : 'Packages, search, and the app catalog.'],
    ['steps.html', 'steps', t('steps'), lang === 'ar' ? 'الترتيب الصحيح لتجهيز ويندوز.' : 'The correct order for setting up Windows.'],
    ['compare.html', 'compare', t('compare'), lang === 'ar' ? 'مقارنة البدائل قبل التثبيت.' : 'Compare alternatives before installing.'],
    ['favorites.html', 'heart', t('favorites'), lang === 'ar' ? 'البرامج المحفوظة داخل المتصفح.' : 'Apps saved in this browser.'],
    ['videos.html', 'video', t('videos'), lang === 'ar' ? 'شروحات تحسين وتنظيف ويندوز.' : 'Windows optimization and cleanup videos.'],
    ['about.html', 'info', t('about'), lang === 'ar' ? 'هدف الموقع وطريقة عمله.' : 'The purpose of the site and how it works.'],
    ['privacy.html', 'shield', t('privacy'), lang === 'ar' ? 'طريقة حفظ البيانات المحلية.' : 'How local data is stored.'],
    ['report.html', 'report', t('report'), lang === 'ar' ? 'إنشاء بلاغ عن رابط أو معلومة.' : 'Create a report for a link or information issue.']
  ];
  pagesBox.innerHTML = pages.map(([href, icon, title, desc]) => `<a class="sitemap-card" href="${href}"><span class="sitemap-icon">${uiIcon(icon)}</span><span><strong>${title}</strong><small>${desc}</small></span>${uiIcon('arrow')}</a>`).join('');
  packagesBox.innerHTML = Object.keys(D.packages).map(id => `<a class="chip sitemap-chip" href="index.html?package=${id}#programs"><img src="icons/packages/${id}.svg" alt="" width="30" height="30"><span>${esc(packageName(id))}</span><small>${packageApps(id).length}</small></a>`).join('');
  const groups = new Map();
  visibleApps.forEach(app => {
    const category = appCategory(app);
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(app);
  });
  appsBox.innerHTML = [...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0], lang)).map(([category, apps]) => `<details class="sitemap-group"><summary>${uiIcon('apps')}<span>${esc(category)}</span><small>${apps.length}</small></summary><div class="sitemap-app-list">${apps.sort((a,b)=>a.name.localeCompare(b.name,'en')).map(app => `<a href="app.html?id=${encodeURIComponent(app.id)}">${logo(app)}<span>${esc(app.name)}</span>${uiIcon('arrow')}</a>`).join('')}</div></details>`).join('');
  const xml = document.getElementById('sitemap-xml-link');
  if (xml) xml.innerHTML = iconText('sitemap', lang === 'ar' ? 'فتح خريطة XML لمحركات البحث' : 'Open the XML sitemap for search engines');
}

function setupReport() {
  const form = document.getElementById('report-form');
  if (!form) return;
  const out = document.getElementById('report-output');
  if (out) out.textContent = t('reportPlaceholder');
  const build = () => lang === 'ar'
    ? `اسم البرنامج: ${document.getElementById('report-app').value}\nالرابط: ${document.getElementById('report-url').value}\nنوع المشكلة: ${document.getElementById('report-type').value}\nالتفاصيل: ${document.getElementById('report-notes').value || t('reportNone')}`
    : `App name: ${document.getElementById('report-app').value}\nLink: ${document.getElementById('report-url').value}\nIssue type: ${document.getElementById('report-type').value}\nDetails: ${document.getElementById('report-notes').value || t('reportNone')}`;

  form.addEventListener('submit', e => {
    e.preventDefault();
    out.textContent = build();
    toast(t('reportReady'));
  });
  document.getElementById('copy-report').addEventListener('click', async () => {
    out.textContent = build();
    try { await navigator.clipboard.writeText(out.textContent); toast(t('reportCopied')); } catch {}
  });
}

setupShell();
const p = document.body?.dataset.page;
({ home: renderHome, app: renderDetail, favorites: renderFavorites, compare: renderCompare, steps: renderSteps, videos: renderVideos, report: setupReport, sitemap: renderSitemap }[p] || (() => {}))();

})();
