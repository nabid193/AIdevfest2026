import { useEffect, useRef, useState } from 'react';
import { parseRequirements, RequirementsImportError, type TenderRequirements } from './features/requirements/parseRequirements';
import Workflow from './components/Workflow';
import { importErrors, messages, type Language } from './i18n/messages';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [loaded, setLoaded] = useState<{ data: TenderRequirements; filename: string; version: number } | null>(null);
  const [error, setError] = useState<RequirementsImportError | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const t = messages[language];
  const numbers = new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-GB');
  useEffect(() => { document.documentElement.lang = language; document.title = `${t.brand} · ${t.step1}`; }, [language, t.brand, t.step1]);

  async function importFile(file: File) {
    if (loaded && !window.confirm(language === 'bn' ? 'নতুন দরপত্র যোগ করলে বর্তমান PDF ও মেলানো তথ্য মুছে যাবে। চালিয়ে যাবেন?' : 'Replacing the tender clears the current PDFs and matches after successful import. Continue?')) return;
    const current = ++request.current;
    setBusy(true); setError(null);
    try {
      const data = parseRequirements(await file.text());
      if (current === request.current) setLoaded({ data, filename: file.name, version: current });
    } catch (failure) {
      if (current === request.current) setError(failure instanceof RequirementsImportError ? failure : new RequirementsImportError('readFailed'));
    } finally { if (current === request.current) setBusy(false); }
  }
  const requirements = loaded?.data.requirements ?? [];
  const mandatory = requirements.filter(item => item.mandatory).length;
  const tender = loaded?.data.tender;

  return <div className="workspace">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark" aria-hidden="true">▤</span><span>{t.brand}</span></div><p className="brand-caption">{t.workspace}</p>
      <nav aria-label={t.navigation}><ol className="steps">{[t.step1, t.step2, t.step3, t.step4].map((label, index) => <li key={index} aria-current={index === 0 ? 'step' : undefined} className={index === 0 ? 'active' : ''}>
        <span className="step-number">{numbers.format(index + 1)}</span><span><a href={`#${["requirements", "documents", "review", "package"][index]}`}>{label}</a></span>
      </li>)}</ol></nav>
      <div className="privacy"><span aria-hidden="true">◈</span><strong>{t.local}</strong></div>
    </aside>
    <div className="main-area">
      <header className="topbar"><span>{t.navigation}</span><div className="language-control" role="group" aria-label={t.language}>
        <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button><button type="button" lang="bn" aria-pressed={language === 'bn'} onClick={() => setLanguage('bn')}>বাংলা</button>
      </div></header>
      <main>
        <div className="page-heading"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p></div>
        <section className="import-card" aria-labelledby="import-title" aria-busy={busy}>
          <div className="file-icon" aria-hidden="true">↥</div><div className="import-copy"><h2 id="import-title">{t.importTitle}</h2><p>{t.importDetail}</p><small>{t.jsonNote}</small></div>
          <input ref={input} type="file" hidden accept=".json,application/json" aria-label={t.fileLabel} onChange={event => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; if (file) void importFile(file); }} />
          <button className="primary" type="button" disabled={busy} onClick={() => input.current?.click()}>{busy ? t.loading : loaded ? t.replace : t.choose}<span aria-hidden="true"> ↑</span></button>
        </section>
        <div role="status" aria-live="polite" className="import-status">{busy ? t.loading : loaded && !error ? `${t.loaded} · ${loaded.filename}` : ''}</div>
        {error && <div className="error-panel" role="alert"><strong>{t.errorTitle}</strong><p>{importErrors[language][error.code]}</p>{error.field && <p>{t.field}: <code>{error.field}</code></p>}{loaded && <p>{t.preserved}</p>}</div>}
        {tender && loaded ? <>
          <section id="requirements" className="overview" aria-labelledby="overview-title"><div className="section-label" id="overview-title">{t.overview}</div><h2>{tender.title}</h2>
            <dl className="tender-details">
              <div><dt>{t.tenderId}</dt><dd>{tender.tender_id}</dd></div><div><dt>{t.entity}</dt><dd>{tender.procuring_entity}</dd></div><div><dt>{t.bidder}</dt><dd>{tender.bidder}</dd></div>
              <div><dt>{t.deadline}</dt><dd><time dateTime={tender.submission_deadline}>{new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${tender.submission_deadline}T00:00:00Z`))}</time></dd></div>
            </dl>
          </section>
          <dl className="stats">{[[t.total, requirements.length], [t.mandatory, mandatory], [t.optional, requirements.length - mandatory], [t.expiryCount, requirements.filter(item => item.has_expiry).length]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{numbers.format(Number(value))}</dd></div>)}</dl>
          <Workflow key={loaded.version} data={loaded.data} language={language} />
        </> : <section className="empty-state"><div className="empty-mark" aria-hidden="true">☷</div><h2>{t.emptyTitle}</h2><p>{t.emptyDetail}</p></section>}
        <footer>{t.footer}</footer>
      </main>
    </div>
  </div>;
}
