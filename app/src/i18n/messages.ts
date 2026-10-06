import type { ImportErrorCode } from '../features/requirements/parseRequirements';
export type Language = 'en' | 'bn';
const en = {
  brand: 'TenderDesk', workspace: 'DOCUMENT PACKAGE BUILDER',
  navigation: 'Package preparation', step1: 'Tender requirements', step2: 'Upload documents', step3: 'Match & review', step4: 'Create package',
  current: 'Current step', upcoming: 'Coming next', local: 'Files stay on your device', localDetail: 'Your tender information is read locally in this browser.',
  eyebrow: 'STEP 1 · REQUIREMENTS', title: 'Start with the requirements.', intro: 'Import the tender’s requirements file to see what belongs in your submission.',
  importTitle: 'Import your requirements', importDetail: 'Choose the requirements.json file supplied with your tender.',
  choose: 'Choose JSON file', replace: 'Replace JSON file', loading: 'Reading file…', fileLabel: 'Tender requirements JSON file',
  jsonNote: 'JSON files only. PDF documents are added in the next step.',
  emptyTitle: 'Your checklist starts here', emptyDetail: 'Once you import a file, the tender details and ordered document requirements will appear below.',
  loaded: 'Requirements imported', loadedFile: 'Source file', errorTitle: 'Could not import this file', preserved: 'Your previously imported tender is still available below.', field: 'Field',
  overview: 'Tender overview', tenderId: 'Tender ID', entity: 'Procuring entity', bidder: 'Bidder', deadline: 'Submission deadline',
  total: 'Documents listed', mandatory: 'Mandatory', optional: 'Optional', expiryCount: 'Need expiry dates',
  checklist: 'Document requirements', checklistHint: 'Listed in the order requested by the tender.',
  order: 'Order', document: 'Document', obligation: 'Requirement', expiry: 'Expiry date', needed: 'Required when supplied', notNeeded: 'Not required',
  footer: 'Next: add your PDF documents. Document upload and package generation will be available in the following parts.', language: 'Language',
};
type Messages = Record<keyof typeof en, string>;
export const messages: Record<Language, Messages> = {
  en,
  bn: {
    brand: 'টেন্ডারডেস্ক', workspace: 'দরপত্রের নথি প্যাকেজ প্রস্তুতকারী',
    navigation: 'প্যাকেজ প্রস্তুতির ধাপ', step1: 'দরপত্রের চাহিদা', step2: 'নথি যোগ করুন', step3: 'মিলিয়ে যাচাই করুন', step4: 'প্যাকেজ তৈরি করুন',
    current: 'বর্তমান ধাপ', upcoming: 'পরবর্তী ধাপে আসছে', local: 'ফাইল আপনার ডিভাইসেই থাকে', localDetail: 'দরপত্রের তথ্য এই ব্রাউজারেই পড়া হয়।',
    eyebrow: 'ধাপ ১ · চাহিদা', title: 'চাহিদার তালিকা দিয়ে শুরু করুন।', intro: 'দরপত্রের চাহিদার ফাইল যোগ করে জমা দেওয়ার জন্য প্রয়োজনীয় নথিগুলো দেখুন।',
    importTitle: 'চাহিদার ফাইল যোগ করুন', importDetail: 'দরপত্রের সঙ্গে দেওয়া requirements.json ফাইলটি নির্বাচন করুন।',
    choose: 'JSON ফাইল নির্বাচন করুন', replace: 'JSON ফাইল পরিবর্তন করুন', loading: 'ফাইল পড়া হচ্ছে…', fileLabel: 'দরপত্রের চাহিদার JSON ফাইল',
    jsonNote: 'শুধু JSON ফাইল। পরবর্তী ধাপে PDF নথি যোগ করা যাবে।',
    emptyTitle: 'আপনার তালিকা এখান থেকেই শুরু', emptyDetail: 'ফাইল যোগ করলে নিচে দরপত্রের তথ্য ও ক্রমানুসারে প্রয়োজনীয় নথির তালিকা দেখা যাবে।',
    loaded: 'চাহিদার তালিকা যোগ হয়েছে', loadedFile: 'উৎস ফাইল', errorTitle: 'এই ফাইলটি যোগ করা যায়নি', preserved: 'আগে যোগ করা দরপত্রের তথ্য নিচে অক্ষত রয়েছে।', field: 'ঘর',
    overview: 'দরপত্রের তথ্য', tenderId: 'দরপত্রের আইডি', entity: 'ক্রয়কারী প্রতিষ্ঠান', bidder: 'দরদাতা', deadline: 'জমা দেওয়ার শেষ তারিখ',
    total: 'মোট নথি', mandatory: 'বাধ্যতামূলক', optional: 'ঐচ্ছিক', expiryCount: 'মেয়াদের তারিখ প্রয়োজন',
    checklist: 'প্রয়োজনীয় নথির তালিকা', checklistHint: 'দরপত্রে চাওয়া ক্রম অনুযায়ী সাজানো হয়েছে।',
    order: 'ক্রম', document: 'নথি', obligation: 'প্রয়োজনীয়তা', expiry: 'মেয়াদের তারিখ', needed: 'নথি দিলে প্রয়োজন', notNeeded: 'প্রয়োজন নেই',
    footer: 'এরপর: PDF নথি যোগ করা। পরবর্তী অংশগুলোতে নথি যোগ করা ও প্যাকেজ তৈরির সুবিধা আসবে।', language: 'ভাষা',
  },
};
export const importErrors: Record<Language, Record<ImportErrorCode, string>> = {
  en: {
    invalidJson: 'This is not valid JSON. Choose the tender’s requirements.json file.',
    objectExpected: 'A required section is missing or is not a JSON object.',
    textExpected: 'A required text field is missing, blank, or has the wrong type.',
    listExpected: 'The file must contain a non-empty requirements list.',
    booleanExpected: 'This value must be true or false, without quotation marks.',
    orderExpected: 'Each document order must be a positive whole number.',
    dateExpected: 'The submission deadline must be a real calendar date in YYYY-MM-DD format.',
    duplicateId: 'Two requirements have the same ID. Each requirement needs a unique ID.',
    readFailed: 'The file could not be read. Select it again and retry.',
  },
  bn: {
    invalidJson: 'এটি সঠিক JSON নয়। দরপত্রের requirements.json ফাইলটি নির্বাচন করুন।',
    objectExpected: 'প্রয়োজনীয় একটি অংশ নেই অথবা সেটি JSON অবজেক্ট নয়।',
    textExpected: 'প্রয়োজনীয় লেখার ঘর নেই, খালি আছে অথবা ভুল ধরনের মান রয়েছে।',
    listExpected: 'ফাইলে অন্তত একটি নথিসহ চাহিদার তালিকা থাকতে হবে।',
    booleanExpected: 'এই মানটি উদ্ধৃতি চিহ্ন ছাড়া true অথবা false হতে হবে।',
    orderExpected: 'প্রতিটি নথির ক্রম একটি ধনাত্মক পূর্ণসংখ্যা হতে হবে।',
    dateExpected: 'জমা দেওয়ার শেষ তারিখ YYYY-MM-DD বিন্যাসে একটি বাস্তব তারিখ হতে হবে।',
    duplicateId: 'দুটি চাহিদার আইডি একই। প্রতিটির আলাদা আইডি থাকতে হবে।',
    readFailed: 'ফাইলটি পড়া যায়নি। আবার নির্বাচন করে চেষ্টা করুন।',
  },
};
