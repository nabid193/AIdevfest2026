import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';

const sample = new URL('../ViveCoding Problem/problem-pack/sample-pack/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('./fixtures/sample-manifest.json', import.meta.url), 'utf8')) as {
  requirementsSha256: string;
  files: { name: string; bytes: number; sha256: string; pages?: number }[];
};
const digest = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const documentUrl = (name: string) => new URL(`documents/${encodeURIComponent(name)}`, sample);

describe('official sample evidence and PDF library compatibility (not app acceptance)', () => {
  it('preserves the exact provided JSON and document inventory', async () => {
    expect(digest(await readFile(new URL('requirements.json', sample)))).toBe(manifest.requirementsSha256);
    expect((await readdir(new URL('documents/', sample))).sort()).toEqual(manifest.files.map(f => f.name).sort());
    for (const file of manifest.files) {
      const bytes = await readFile(documentUrl(file.name));
      expect(bytes.length, file.name).toBe(file.bytes);
      expect(digest(bytes), file.name).toBe(file.sha256);
    }
  });

  it.each(manifest.files.filter(file => file.pages !== undefined))('loads $name with independently verified page count', async file => {
    const pdf = await PDFDocument.load(await readFile(documentUrl(file.name)));
    expect(pdf.getPageCount()).toBe(file.pages);
  });

  it('confirms the supplied duplicate has identical contents under another name', async () => {
    const original = await readFile(documentUrl('experience_cert.pdf'));
    const duplicate = await readFile(documentUrl('experience_cert (1).pdf'));
    expect(original.equals(duplicate)).toBe(true);
  });

  it('rejects the supplied PNG when loaded as a PDF', async () => {
    await expect(PDFDocument.load(await readFile(documentUrl('company_logo.png')))).rejects.toThrow();
  });

  it('can serialize and reopen the image-only declaration without losing its page', async () => {
    const source = await PDFDocument.load(await readFile(documentUrl('scan_0042.pdf')));
    const reopened = await PDFDocument.load(await source.save());
    expect(reopened.getPageCount()).toBe(1);
    // Visual content preservation is a later mandatory browser/export review, not proved by this assertion.
  });
});
