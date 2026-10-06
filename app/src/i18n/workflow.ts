import type { Language } from './messages';
const en = {
  upload: 'Upload PDF documents', uploadHint: 'Select up to 30 PDFs, 50 MB total. Match each document below. Files never leave your browser.', add: 'Add PDFs', files: 'Uploaded files', pages: 'pages', remove: 'Remove', preview: 'Preview', duplicate: 'Duplicate content', noFiles: 'No PDFs added yet.',
  notPdf: 'Not a PDF file.', badPdf: 'This PDF is damaged or unsupported. Choose a readable PDF.', encrypted: 'Password-protected PDFs are not supported. Add an unlocked copy.', tooMany: 'Maximum 30 files. Remove a file before adding another.', tooLarge: 'The combined PDF upload limit is 50 MB.', readFailed: 'Could not read this file. Try again.',
  match: 'Match & review', matchHint: 'Choose one file per requirement. Matching is manual: check the actual document and enter its expiry date.', select: 'No file selected', used: 'Already matched', file: 'Matched PDF', expiry: 'Expiry date', status: 'Status', optional: 'Optional', mandatory: 'Mandatory', noExpiry: 'Not required',
  missing: 'Missing', expiryNeeded: 'Expiry date needed', expired: 'Expired', notProvided: 'Not provided', ok: 'OK',
  ready: 'Ready to create your package', blocked: 'Resolve the following before generating', generate: 'Generate & download PDF', generating: 'Creating package…', processing: 'Reading PDFs…', busy: 'Please wait…',
  package: 'Create your package', packageHint: 'One English cover, then all matched pages in tender order. Each page receives a footer in a separate margin.', included: 'Included documents', totalPages: 'Total package pages', generated: 'Package created successfully.', download: 'Download again', exportCsv: 'Export checklist CSV',
  generationError: 'The package could not be created. Check your PDF files and try again.', unsupportedText: 'Some tender text uses characters outside the bundled English/Bangla fonts. Please use supported text or contact the organizer.',
  fontLoad: 'The bundled fonts could not be loaded. Check the website connection and retry.', memory: 'Work stays in this tab. Download your package before closing or refreshing.', invalidDate: 'Use a real date in YYYY-MM-DD format.',
};
export const workflowMessages: Record<Language, Record<keyof typeof en, string>> = {
  en,
  bn: {
    upload: 'PDF নথি যোগ করুন', uploadHint: 'সর্বোচ্চ ৩০টি PDF, মোট ৫০ MB। নিচে প্রতিটি নথি মিলিয়ে দিন। ফাইল ব্রাউজারের বাইরে যায় না।', add: 'PDF যোগ করুন', files: 'যোগ করা ফাইল', pages: 'পৃষ্ঠা', remove: 'সরান', preview: 'দেখুন', duplicate: 'একই বিষয়বস্তুর অনুলিপি', noFiles: 'এখনো PDF যোগ করা হয়নি।',
    notPdf: 'এটি PDF ফাইল নয়।', badPdf: 'এই PDF ক্ষতিগ্রস্ত অথবা সমর্থিত নয়। পড়া যায় এমন PDF দিন।', encrypted: 'পাসওয়ার্ডযুক্ত PDF সমর্থিত নয়। আনলক করা কপি দিন।', tooMany: 'সর্বোচ্চ ৩০টি ফাইল। নতুন ফাইল যোগ করার আগে একটি সরান।', tooLarge: 'সব PDF মিলিয়ে সর্বোচ্চ ৫০ MB যোগ করা যাবে।', readFailed: 'ফাইল পড়া যায়নি। আবার চেষ্টা করুন।',
    match: 'মিলিয়ে যাচাই করুন', matchHint: 'প্রতিটি চাহিদার জন্য একটি ফাইল নির্বাচন করুন। নথি নিজে যাচাই করে মিলিয়ে দিন এবং মেয়াদের তারিখ লিখুন।', select: 'ফাইল নির্বাচন করা হয়নি', used: 'আগেই মেলানো হয়েছে', file: 'মেলানো PDF', expiry: 'মেয়াদের তারিখ', status: 'অবস্থা', optional: 'ঐচ্ছিক', mandatory: 'বাধ্যতামূলক', noExpiry: 'প্রয়োজন নেই',
    missing: 'নথি নেই', expiryNeeded: 'মেয়াদের তারিখ প্রয়োজন', expired: 'মেয়াদোত্তীর্ণ', notProvided: 'দেওয়া হয়নি', ok: 'ঠিক আছে',
    ready: 'প্যাকেজ তৈরির জন্য প্রস্তুত', blocked: 'প্যাকেজ তৈরির আগে নিচের সমস্যাগুলো সমাধান করুন', generate: 'PDF তৈরি ও ডাউনলোড করুন', generating: 'প্যাকেজ তৈরি হচ্ছে…', processing: 'PDF পড়া হচ্ছে…', busy: 'অপেক্ষা করুন…',
    package: 'প্যাকেজ তৈরি করুন', packageHint: 'একটি ইংরেজি প্রচ্ছদের পরে দরপত্রের ক্রমে সব মেলানো পৃষ্ঠা থাকবে। প্রতিটি পৃষ্ঠায় আলাদা জায়গায় পৃষ্ঠা নম্বর যোগ হবে।', included: 'অন্তর্ভুক্ত নথি', totalPages: 'প্যাকেজের মোট পৃষ্ঠা', generated: 'প্যাকেজ তৈরি হয়েছে।', download: 'আবার ডাউনলোড করুন', exportCsv: 'তালিকা CSV হিসেবে নিন',
    generationError: 'প্যাকেজ তৈরি করা যায়নি। PDF ফাইলগুলো যাচাই করে আবার চেষ্টা করুন।', unsupportedText: 'দরপত্রের কিছু অক্ষর সংযুক্ত ইংরেজি/বাংলা ফন্টে নেই। সমর্থিত লেখা ব্যবহার করুন অথবা আয়োজকের সঙ্গে যোগাযোগ করুন।',
    fontLoad: 'সংযুক্ত ফন্ট লোড হয়নি। ওয়েবসাইটের সংযোগ যাচাই করে আবার চেষ্টা করুন।', memory: 'কাজ এই ট্যাবেই থাকে। বন্ধ বা রিফ্রেশ করার আগে প্যাকেজ ডাউনলোড করুন।', invalidDate: 'YYYY-MM-DD বিন্যাসে বাস্তব তারিখ দিন।',
  },
};
