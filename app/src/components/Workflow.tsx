import { useEffect, useRef, useState } from 'react';
import { availableFor, blocking, review, type UploadedPdf, type Matches, type Expiries } from '../domain/checklist';
import type { IntakeCode } from '../features/documents/intake';
import type { CoverLogo, LogoErrorCode } from '../features/package/logo';
import { validDate, type TenderRequirements } from '../features/requirements/parseRequirements';
import { workflowMessages } from '../i18n/workflow';
import { messages, type Language } from '../i18n/messages';

function download(url: string, name: string) {
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name;
  document.body.append(anchor); anchor.click(); anchor.remove();
}
function getLogoErrorCode(error: unknown): LogoErrorCode {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = error.code;
    if (code === 'logoType' || code === 'logoInvalid') return code;
  }
  return 'logoInvalid';
}
export default function Workflow({ data, language }: { data: TenderRequirements; language: Language }) {
  const t = workflowMessages[language]; const labels = messages[language];
  const [files, setFiles] = useState<UploadedPdf[]>([]);
  const [matches, setMatches] = useState<Matches>({});
  const [expiries, setExpiries] = useState<Expiries>({});
  const [errors, setErrors] = useState<{ name: string; code: IntakeCode }[]>([]);
  const [working, setWorking] = useState<'upload' | 'logo' | 'generate' | null>(null);
  const [generationError, setGenerationError] = useState<'generationError' | 'unsupportedText' | 'fontLoad' | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [coverLogo, setCoverLogo] = useState<(CoverLogo & { previewUrl: string }) | null>(null);
  const [logoError, setLogoError] = useState<LogoErrorCode | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const logoInput = useRef<HTMLInputElement>(null);
  const logoUrl = useRef<string | null>(null);
  const active = useRef(true);
  const inProgress = useRef(false);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result); }, [result]);
  useEffect(() => () => { if (logoUrl.current) URL.revokeObjectURL(logoUrl.current); }, []);
  const rows = review(data, files, matches, expiries);
  const blocked = rows.filter(row => blocking(row.status));
  const included = rows.filter(row => row.file);
  const pages = 1 + included.reduce((total, row) => total + row.file!.pages, 0);
  const number = (value: number) => new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-GB').format(value);
  const filename = `${data.tender.tender_id.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')}_Package.pdf`;
  function invalidate() { setResult(null); setGenerationError(null); }

  async function addFiles(incoming: File[]) {
    if (inProgress.current) return;
    inProgress.current = true; setWorking('upload'); setErrors([]); invalidate();
    const next = [...files]; const rejected: { name: string; code: IntakeCode }[] = [];
    try {
      // PDF parsing is loaded only when the user starts adding documents.
      const { checkCapacity, inspectPdf, IntakeError } = await import('../features/documents/intake');
      for (const file of incoming) {
        try {
          checkCapacity(next.length, next.reduce((sum, item) => sum + item.size, 0), file.size);
          const pdf = await inspectPdf(file.name, new Uint8Array(await file.arrayBuffer()));
          next.push(pdf);
        } catch (error) { rejected.push({ name: file.name, code: error instanceof IntakeError ? error.code : 'readFailed' }); }
      }
      if (active.current) { setFiles(next); setErrors(rejected); }
    } catch {
      // A failed lazy import or unexpected intake failure should be shown in the UI, not
      // become an unhandled promise rejection from the file-picker event handler.
      if (active.current) setErrors(incoming.map(file => ({ name: file.name, code: 'readFailed' as const })));
    } finally { inProgress.current = false; if (active.current) setWorking(null); }
  }
  async function addLogo(file: File | undefined) {
    if (!file || inProgress.current) return;
    inProgress.current = true; setWorking('logo'); setLogoError(null); invalidate();
    try {
      const { inspectCoverLogo } = await import('../features/package/logo');
      const selected = await inspectCoverLogo(file.name, new Uint8Array(await file.arrayBuffer()));
      if (active.current) {
        if (logoUrl.current) URL.revokeObjectURL(logoUrl.current);
        const previewUrl = URL.createObjectURL(new Blob([selected.bytes], { type: selected.type }));
        logoUrl.current = previewUrl;
        setCoverLogo({ ...selected, previewUrl });
      }
    } catch (error) {
      if (active.current) setLogoError(getLogoErrorCode(error));
    } finally { inProgress.current = false; if (active.current) setWorking(null); }
  }
  function removeLogo() {
    if (logoUrl.current) URL.revokeObjectURL(logoUrl.current);
    logoUrl.current = null; setCoverLogo(null); setLogoError(null); invalidate();
  }
  function match(id: string, fileId: string) {
    const file = files.find(item => item.id === fileId);
    if (file && !availableFor(id, file, matches, files)) return;
    invalidate(); setMatches(previous => ({ ...previous, [id]: fileId }));
    setExpiries(previous => ({ ...previous, [id]: '' }));
  }
  function remove(id: string) {
    invalidate(); setFiles(previous => previous.filter(file => file.id !== id));
    const nextMatches = { ...matches }; const nextDates = { ...expiries };
    for (const [requirement, fileId] of Object.entries(nextMatches)) if (fileId === id) { delete nextMatches[requirement]; delete nextDates[requirement]; }
    setMatches(nextMatches); setExpiries(nextDates);
  }
  async function generate() {
    if (inProgress.current || blocked.length) return;
    inProgress.current = true; setWorking('generate'); invalidate();
    try {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      // PDF generation and font embedding are lazy-loaded to keep the first page light.
      const [{ createPackage }, { loadPackageFonts }] = await Promise.all([
        import('../features/package/createPackage'),
        import('../features/package/fonts'),
      ]);
      const bytes = await createPackage(data, files, matches, expiries, await loadPackageFonts(), today, coverLogo ?? undefined);
      if (active.current) {
        const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
        setResult(url); download(url, filename);
      }
    } catch (error) {
      if (active.current) setGenerationError(error instanceof Error && (error.message === 'unsupportedText' || error.message === 'fontLoad') ? error.message : 'generationError');
    } finally { inProgress.current = false; if (active.current) setWorking(null); }
  }
  function exportCsv() {
    const cell = (value: string) => `"${(/^[=+@-]/.test(value) ? "'" : '') + value.replaceAll('"', '""')}"`;
    const table = [[labels.document, t.file, t.pages, t.expiry, t.status], ...rows.map(row => [language === 'bn' ? row.requirement.title_bn : row.requirement.title_en, row.file?.name ?? '', String(row.file?.pages ?? ''), expiries[row.requirement.id] ?? '', t[row.status]])];
    const url = URL.createObjectURL(new Blob(['\uFEFF' + table.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    download(url, 'Tender_Checklist.csv'); setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
  return <div className="workflow">
    <fieldset disabled={working !== null} className="workflow-controls">
      <section id="documents" className="upload-section" aria-labelledby="upload-heading">
        <div className="section-heading"><div><h2 id="upload-heading">{t.upload}</h2><p>{t.uploadHint}</p></div><button className="primary" type="button" onClick={() => fileInput.current?.click()}>{t.add}</button></div>
        <input hidden ref={fileInput} type="file" accept=".pdf,application/pdf" multiple aria-label={t.add} onChange={event => { const selected = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ''; void addFiles(selected); }} />
        <p className="file-counter">{t.files}: {number(files.length)} / {number(30)} · {number(Number((files.reduce((sum, file) => sum + file.size, 0) / 1_000_000).toFixed(2)))} / {number(50)} MB</p>
        {errors.length > 0 && <ul role="alert" className="error-panel">{errors.map((error, index) => <li key={index}><strong>{error.name}</strong>: {t[error.code]}</li>)}</ul>}
        {!files.length && <p className="file-counter">{t.noFiles}</p>}
        <ul className="file-list">{files.map(file => <li key={file.id}>
          <div><strong>{file.name}</strong><small>{number(file.pages)} {t.pages} · {number(Math.ceil(file.size / 1000))} KB</small>{files.some(other => other.id !== file.id && other.hash === file.hash) && <span className="badge duplicate">{t.duplicate}</span>}</div>
          <div className="file-actions"><button type="button" aria-label={`${t.preview}: ${file.name}`} onClick={() => { const url = URL.createObjectURL(new Blob([file.bytes], { type: 'application/pdf' })); window.open(url, '_blank', 'noopener,noreferrer'); setTimeout(() => URL.revokeObjectURL(url), 60_000); }}>{t.preview}</button><button type="button" aria-label={`${t.remove}: ${file.name}`} onClick={() => remove(file.id)}>{t.remove}</button></div>
        </li>)}</ul>
      </section>
      <section id="review" className="checklist" aria-labelledby="review-heading">
        <div className="section-heading"><div><h2 id="review-heading">{t.match}</h2><p>{t.matchHint}</p></div><button type="button" className="secondary" onClick={exportCsv}>{t.exportCsv}</button></div>
        <div className="table-scroll" tabIndex={0} role="region" aria-label={t.match}><table className="review-table"><thead><tr><th scope="col">{labels.document}</th><th scope="col">{t.file}</th><th scope="col">{t.expiry}</th><th scope="col">{t.status}</th></tr></thead><tbody>{rows.map(({ requirement, file, status }) => <tr key={requirement.id}>
          <td><strong>{number(requirement.order)}. {language === 'bn' ? requirement.title_bn : requirement.title_en}</strong><small className="requirement-id">{requirement.id} · {requirement.mandatory ? t.mandatory : t.optional}</small></td>
          <td><select value={matches[requirement.id] ?? ''} aria-label={`${t.file}: ${requirement.id}`} onChange={event => match(requirement.id, event.target.value)}><option value="">{t.select}</option>{files.map(option => <option key={option.id} value={option.id} disabled={!availableFor(requirement.id, option, matches, files)}>{option.name}{!availableFor(requirement.id, option, matches, files) ? ` · ${t.used}` : ''}</option>)}</select>{file && <small>{number(file.pages)} {t.pages}</small>}</td>
          <td>{requirement.has_expiry && file ? <><input type="date" aria-label={`${t.expiry}: ${requirement.id}`} value={expiries[requirement.id] ?? ''} onChange={event => { invalidate(); setExpiries(previous => ({ ...previous, [requirement.id]: event.target.value })); }} />{expiries[requirement.id] && !validDate(expiries[requirement.id]!) && <small>{t.invalidDate}</small>}</> : <span className="expiry">{requirement.has_expiry ? '—' : t.noExpiry}</span>}</td>
          <td><span className={`badge status-${status}`}>{t[status]}</span></td>
        </tr>)}</tbody></table></div>
      </section>
      <section id="package" className="package-panel" aria-labelledby="package-heading">
        <h2 id="package-heading">{t.package}</h2><p>{t.packageHint}</p>
        <div className="logo-picker" aria-label={t.logoTitle}>
          <div><strong>{t.logoTitle}</strong><p>{t.logoHint}</p></div>
          <input ref={logoInput} hidden type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" aria-label={t.logoTitle} onChange={event => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; void addLogo(file); }} />
          <div className="logo-picker-actions">
            {coverLogo && <div className="logo-preview"><img src={coverLogo.previewUrl} alt={t.logoPreview} /><span>{coverLogo.name}</span></div>}
            <button type="button" className="secondary" onClick={() => logoInput.current?.click()}>{coverLogo ? t.replaceLogo : t.addLogo}</button>
            {coverLogo && <button type="button" className="secondary" onClick={removeLogo}>{t.removeLogo}</button>}
          </div>
          {logoError && <p className="logo-error" role="alert">{t[logoError]}</p>}
        </div>
        <p>{t.included}: <strong>{number(included.length)}</strong> · {t.totalPages}: <strong>{number(pages)}</strong></p>
        <div aria-live="polite">{blocked.length ? <details open><summary>{t.blocked} ({number(blocked.length)})</summary><ul>{blocked.map(row => <li key={row.requirement.id}>{language === 'bn' ? row.requirement.title_bn : row.requirement.title_en}: {t[row.status]}</li>)}</ul></details> : <p className="ready">✓ {t.ready}</p>}</div>
        <button type="button" className="primary" disabled={blocked.length > 0 || working !== null} onClick={() => void generate()}>{working === 'generate' ? t.generating : t.generate}</button>
      </section>
    </fieldset>
    <p role="status" className="import-status">{working === 'upload' ? t.processing : working === 'logo' ? t.logoProcessing : working === 'generate' ? t.generating : result ? t.generated : ''}</p>
    {generationError && <p role="alert" className="error-panel">{t[generationError]}</p>}
    {result && <a className="download-link" href={result} download={filename}>{t.download} · {filename}</a>}
    <p className="session-note">{t.memory}</p>
  </div>;
}
