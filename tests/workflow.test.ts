import { readFile } from 'node:fs/promises';
import { PDFDict, PDFDocument, PDFName, degrees } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { parseRequirements } from '../app/src/features/requirements/parseRequirements';
import { assertReady, availableFor, review, statusFor, type Matches, type Expiries } from '../app/src/domain/checklist';
import { checkCapacity, inspectPdf, MAX_BYTES } from '../app/src/features/documents/intake';
import { createPackage } from '../app/src/features/package/createPackage';
import { inspectCoverLogo } from '../app/src/features/package/logo';

const root = new URL('../ViveCoding Problem/problem-pack/sample-pack/', import.meta.url);
const data = parseRequirements(await readFile(new URL('requirements.json', root), 'utf8'));
const names = ['trade_license_2026.pdf','03_tin_certificate.pdf','04_vat_certificate.pdf','bank_solvency.pdf','experience_cert.pdf','02_technical_proposal.pdf','01_financial_proposal.pdf','scan_0042.pdf'];
const files = await Promise.all(names.map(async name => inspectPdf(name, new Uint8Array(await readFile(new URL(`documents/${name}`, root))))));
const sampleLogo = new Uint8Array(await readFile(new URL('documents/company_logo.png', root)));
const ids = ['R01','R02','R03','R04','R05','R08','R09','R10'];
const matches: Matches = Object.fromEntries(ids.map((id, i) => [id, files[i]!.id]));
const expiries: Expiries = { R01: '2027-06-30', R04: '2026-12-31' };
const fonts = {
  latin: await readFile(new URL('../node_modules/@fontsource/noto-sans-bengali/files/noto-sans-bengali-latin-400-normal.woff', import.meta.url)),
  bengali: await readFile(new URL('../node_modules/@fontsource/noto-sans-bengali/files/noto-sans-bengali-bengali-400-normal.woff', import.meta.url)),
};
describe('checklist and intake boundaries', () => {
  it('has eight missing and two not provided without files', () => { const rows = review(data, [], {}, {}); expect(rows.filter(r => r.status === 'missing')).toHaveLength(8); expect(rows.filter(r => r.status === 'notProvided')).toHaveLength(2); });
  it('requires expiry, rejects expired and accepts exact-deadline validity', () => {
    const req = data.requirements[0]!;
    expect(statusFor(req, files[0], '', '2026-10-20')).toBe('expiryNeeded');
    expect(statusFor(req, files[0], '2026-10-19', '2026-10-20')).toBe('expired');
    expect(statusFor(req, files[0], '2026-10-20', '2026-10-20')).toBe('ok');
    expect(statusFor(req, files[0], '2026-02-30', '2026-10-20')).toBe('expiryNeeded');
  });
  it('an optional supplied document also needs a valid expiry', () => { const req = data.requirements[6]!; expect(statusFor(req, undefined, '', '2026-10-20')).toBe('notProvided'); expect(statusFor(req, files[0], '', '2026-10-20')).toBe('expiryNeeded'); expect(statusFor(req, files[0], '2025-06-30', '2026-10-20')).toBe('expired'); });
  it('removing the matched file restores Missing', () => expect(review(data, files.slice(1), matches, expiries)[0]!.status).toBe('missing'));
  it('all eight matched documents pass and two optional items remain absent', () => { const rows = assertReady(data, files, matches, expiries); expect(rows.filter(r => r.status === 'ok')).toHaveLength(8); });
  it('prevents identical contents from satisfying two requirements', async () => {
    const duplicate = await inspectPdf('renamed.pdf', new Uint8Array(await readFile(new URL('documents/experience_cert%20(1).pdf', root))));
    expect(duplicate.hash).toBe(files[4]!.hash);
    expect(availableFor('R06', duplicate, matches, [...files, duplicate])).toBe(false);
    expect(availableFor('R05', duplicate, matches, [...files, duplicate])).toBe(true);
    expect(() => assertReady(data, [...files, duplicate], { ...matches, R06: duplicate.id }, expiries)).toThrow('duplicate');
  });
  it('blocks incomplete packages defensively even if invoked outside the UI', () => expect(() => assertReady(data, files, {}, {})).toThrow('blocking'));
  it('enforces exact 30-file and 50 MB boundaries', () => { expect(() => checkCapacity(29, MAX_BYTES - 10, 10)).not.toThrow(); expect(() => checkCapacity(30, 0, 1)).toThrow('tooMany'); expect(() => checkCapacity(0, MAX_BYTES, 1)).toThrow('tooLarge'); });
  it('rejects a PNG irrespective of a misleading PDF filename', async () => { await expect(inspectPdf('pretend.pdf', new Uint8Array(await readFile(new URL('documents/company_logo.png', root))))).rejects.toThrow('notPdf'); });
  it('accepts the supplied company logo separately from PDF intake and rejects invalid images', async () => {
    await expect(inspectCoverLogo('company_logo.png', sampleLogo)).resolves.toMatchObject({ name: 'company_logo.png', type: 'image/png' });
    await expect(inspectCoverLogo('wrong-type.png', files[0]!.bytes)).rejects.toThrow('logoType');
    await expect(inspectCoverLogo('broken.png', new Uint8Array(sampleLogo.slice(0, 24)))).rejects.toThrow('logoInvalid');
  });
  it('rejects corrupted bytes derived from the supplied PDF', async () => { await expect(inspectPdf('cut.pdf', files[0]!.bytes.slice(0, 15))).rejects.toThrow('badPdf'); });
});
describe('package integration using official samples', () => {
  it('builds 16 pages with original page area plus a reserved footer strip', async () => {
    const bytes = await createPackage(data, files, matches, expiries, fonts, '2026-10-06');
    const output = await PDFDocument.load(bytes);
    expect(output.getPageCount()).toBe(16);
    const source = await PDFDocument.load(files[0]!.bytes);
    expect(output.getPage(1).getHeight()).toBeCloseTo(source.getPage(0).getCropBox().height + 36);
    expect(output.getPage(1).getWidth()).toBeCloseTo(source.getPage(0).getCropBox().width);
  });
  it.each([90, 180, 270])('normalizes %s degree rotated source pages without clipping their area', async rotation => {
    const source = await PDFDocument.load(files[0]!.bytes); source.getPage(0).setRotation(degrees(rotation));
    const bytes = new Uint8Array(await source.save()); const rotated = { ...files[0]!, bytes };
    const output = await PDFDocument.load(await createPackage(data, [rotated, ...files.slice(1)], matches, expiries, fonts, '2026-10-06'));
    const crop = source.getPage(0).getCropBox();
    expect(output.getPage(1).getWidth()).toBeCloseTo(rotation === 180 ? crop.width : crop.height);
    expect(output.getPage(1).getHeight()).toBeCloseTo((rotation === 180 ? crop.height : crop.width) + 36);
  });
  it('renders supplied Bangla text on the English cover when it occurs in tender metadata', async () => {
    const translated = { ...data, tender: { ...data.tender, title: data.requirements[0]!.title_bn } };
    await expect(createPackage(translated, files, matches, expiries, fonts, '2026-10-06')).resolves.toBeInstanceOf(Uint8Array);
  });
  it('embeds an optional uploaded logo on the cover without changing the page count', async () => {
    const logo = await inspectCoverLogo('company_logo.png', sampleLogo);
    const bytes = await createPackage(data, files, matches, expiries, fonts, '2026-10-06', logo);
    const output = await PDFDocument.load(bytes);
    const xObjects = output.getPage(0)!.node.Resources()?.lookup(PDFName.of('XObject'), PDFDict);
    expect(output.getPageCount()).toBe(16);
    expect(xObjects?.keys().length).toBeGreaterThan(0);
  });
});
