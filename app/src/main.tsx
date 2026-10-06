import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Application root is missing.');

createRoot(root).render(
  <StrictMode>
    <main>
      <p className="eyebrow">AI DEVFEST 2026 · DEVELOPMENT SETUP</p>
      <h1>Tender Document Package Builder</h1>
      <p>The frontend workspace is ready for implementation.</p>
      <p lang="bn">ফ্রন্টএন্ড তৈরির পরিবেশ প্রস্তুত। অ্যাপের মূল কাজগুলো এখনো তৈরি করা হয়নি।</p>
      <p className="note">Setup checkpoint only. Document import, matching, validation, and PDF generation are not implemented.</p>
    </main>
  </StrictMode>,
);
