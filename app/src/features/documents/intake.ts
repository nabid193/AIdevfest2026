import { PDFDocument } from 'pdf-lib';
import type { UploadedPdf } from '../../domain/checklist';

export const MAX_FILES = 30;
export const MAX_BYTES = 50_000_000;
export type IntakeCode = 'notPdf' | 'badPdf' | 'encrypted' | 'tooMany' | 'tooLarge' | 'readFailed';
export class IntakeError extends Error {
  constructor(public readonly code: IntakeCode) { super(code); }
}
export function checkCapacity(count: number, totalBytes: number, nextSize: number) {
  if (count >= MAX_FILES) throw new IntakeError('tooMany');
  if (totalBytes + nextSize > MAX_BYTES) throw new IntakeError('tooLarge');
}
export async function inspectPdf(name: string, bytes: Uint8Array<ArrayBuffer>): Promise<UploadedPdf> {
  // A MIME/extension check alone cannot establish that a file is actually PDF.
  if (!new TextDecoder('latin1').decode(bytes.subarray(0, 1024)).includes('%PDF-')) throw new IntakeError('notPdf');
  let pdf: PDFDocument;
  try {
    pdf = await PDFDocument.load(bytes, { throwOnInvalidObject: true });
    if (!pdf.getPageCount()) throw new Error('empty');
  }
  catch (error) {
    if (error instanceof Error && /encrypt/i.test(error.message)) throw new IntakeError('encrypted');
    throw new IntakeError('badPdf');
  }
  if (pdf.isEncrypted) throw new IntakeError('encrypted');
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
  return { id: crypto.randomUUID(), name, bytes, size: bytes.byteLength, pages: pdf.getPageCount(), hash };
}
