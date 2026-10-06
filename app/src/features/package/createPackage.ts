import 'regenerator-runtime/runtime.js';
import { PDFDocument, PDFName, rgb, degrees, type PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { assertReady, type UploadedPdf, type Matches, type Expiries } from '../../domain/checklist';
import type { TenderRequirements } from '../requirements/parseRequirements';

export interface PackageFonts { latin: Uint8Array; bengali: Uint8Array }
const clean = (value: string) => value.replace(/[\u0000-\u001f\u007f]/g, ' ');

export async function createPackage(data: TenderRequirements, files: UploadedPdf[], matches: Matches, expiries: Expiries, fonts: PackageFonts, madeOn: string): Promise<Uint8Array<ArrayBuffer>> {
  const rows = assertReady(data, files, matches, expiries);
  const included = rows.filter(row => row.file).sort((a, b) => a.requirement.order - b.requirement.order);
  const output = await PDFDocument.create();
  output.registerFontkit(fontkit);
  const latin = await output.embedFont(fonts.latin, { subset: true });
  const bengali = await output.embedFont(fonts.bengali, { subset: true });
  const fontFor = (char: string) => /[\u0980-\u09ff]/.test(char) ? bengali : latin;
  function runs(value: string) {
    const result: { text: string; font: PDFFont }[] = [];
    for (const char of clean(value)) {
      const font = fontFor(char);
      if (!font.getCharacterSet().includes(char.codePointAt(0)!)) throw new Error('unsupportedText');
      const last = result.at(-1);
      if (last?.font === font) last.text += char;
      else result.push({ text: char, font });
    }
    return result;
  }
  const width = (value: string, size: number) => runs(value).reduce((sum, run) => sum + run.font.widthOfTextAtSize(run.text, size), 0);
  function wrap(value: string, size: number, max: number) {
    const lines: string[] = []; let line = '';
    for (const word of clean(value).split(/\s+/)) {
      if (line && width(`${line} ${word}`, size) > max) { lines.push(line); line = ''; }
      for (const char of word) {
        if (width(line + char, size) > max && line) { lines.push(line); line = ''; }
        line += char;
      }
      line += ' ';
    }
    if (line.trim()) lines.push(line.trim());
    return lines;
  }
  const contents = [
    'TENDER DOCUMENT PACKAGE', '',
    `Tender ID: ${data.tender.tender_id}`, `Tender title: ${data.tender.title}`,
    `Procuring entity: ${data.tender.procuring_entity}`, `Bidder: ${data.tender.bidder}`,
    `Submission deadline: ${data.tender.submission_deadline}`, `Package made on: ${madeOn}`, '',
    'INCLUDED DOCUMENTS (IN SUBMISSION ORDER)',
    ...included.map(row => `${row.requirement.order}. ${row.requirement.title_en} (${row.file!.pages} pages)`),
  ];
  // A single cover remains readable even for long metadata: extend its height instead of clipping text.
  const fontSize = 12;
  const coverLines = contents.flatMap(value => value ? wrap(value, fontSize, 499) : ['']);
  const cover = output.addPage([595, Math.max(842, 112 + coverLines.length * 20)]);
  let y = cover.getHeight() - 58;
  for (const line of coverLines) {
    let x = 48;
    for (const run of runs(line)) { cover.drawText(run.text, { x, y, size: fontSize, font: run.font, color: rgb(.08, .22, .18) }); x += run.font.widthOfTextAtSize(run.text, fontSize); }
    y -= 20;
  }
  for (const row of included) {
    const source = await PDFDocument.load(row.file!.bytes, { throwOnInvalidObject: true });
    // Preserve visible filled form appearances in a static submission package.
    if (source.getForm().getFields().length) source.getForm().flatten();
    for (const original of source.getPages()) {
      const box = original.getCropBox();
      const rotation = ((original.getRotation().angle % 360) + 360) % 360;
      const sideways = rotation === 90 || rotation === 270;
      const w = sideways ? box.height : box.width;
      const h = sideways ? box.width : box.height;
      if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) throw new Error('badPdf');
      const page = output.addPage([w, h + 36]);
      if (original.node.has(PDFName.of('Contents'))) {
        const embedded = await output.embedPage(original, { left: box.x, right: box.x + box.width, bottom: box.y, top: box.y + box.height });
        const x = rotation === 180 ? w : rotation === 270 ? w : 0;
        const y = rotation === 90 || rotation === 180 ? h + 36 : 36;
        page.drawPage(embedded, { x, y, width: box.width, height: box.height, rotate: degrees(-rotation) });
      }
    }
  }
  const total = output.getPageCount();
  for (const [index, page] of output.getPages().entries()) {
    const footer = `${data.tender.tender_id} | Page ${index + 1} of ${total}`;
    const size = Math.min(9, 9 * (page.getWidth() - 24) / Math.max(1, width(footer, 9)));
    let x = (page.getWidth() - width(footer, size)) / 2;
    page.drawLine({ start: { x: 12, y: 32 }, end: { x: page.getWidth() - 12, y: 32 }, thickness: .5, color: rgb(.75,.8,.77) });
    for (const run of runs(footer)) { page.drawText(run.text, { x, y: 13, size, font: run.font, color: rgb(.2,.25,.22) }); x += run.font.widthOfTextAtSize(run.text, size); }
  }
  output.setTitle(`${data.tender.tender_id} - Tender Document Package`);
  output.setAuthor(data.tender.bidder);
  output.setCreator('TenderDesk - browser-only package builder');
  return new Uint8Array(await output.save());
}
