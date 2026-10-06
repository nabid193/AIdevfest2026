import { PDFDocument } from 'pdf-lib';

export type CoverLogoType = 'image/png' | 'image/jpeg';
export interface CoverLogo {
  name: string;
  bytes: Uint8Array<ArrayBuffer>;
  type: CoverLogoType;
}
export type LogoErrorCode = 'logoType' | 'logoInvalid';

export class LogoError extends Error {
  constructor(public readonly code: LogoErrorCode) {
    super(code);
    this.name = 'LogoError';
  }
}

export async function inspectCoverLogo(name: string, bytes: Uint8Array<ArrayBuffer>): Promise<CoverLogo> {
  const png = [137, 80, 78, 71, 13, 10, 26, 10];
  const isPng = bytes.length >= png.length && png.every((byte, index) => bytes[index] === byte);
  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isPng && !isJpeg) throw new LogoError('logoType');

  const type: CoverLogoType = isPng ? 'image/png' : 'image/jpeg';
  try {
    const validator = await PDFDocument.create();
    const image = isPng ? await validator.embedPng(bytes) : await validator.embedJpg(bytes);
    if (image.width < 1 || image.height < 1) throw new Error('emptyImage');
  } catch {
    throw new LogoError('logoInvalid');
  }
  return { name, bytes, type };
}
