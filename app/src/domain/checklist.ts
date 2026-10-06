import { validDate, type Requirement, type TenderRequirements } from '../features/requirements/parseRequirements';

export interface UploadedPdf { id: string; name: string; bytes: Uint8Array<ArrayBuffer>; size: number; pages: number; hash: string }
export type Matches = Record<string, string>;
export type Expiries = Record<string, string>;
export type Status = 'missing' | 'expiryNeeded' | 'expired' | 'notProvided' | 'ok';
export const blocking = (status: Status) => status !== 'ok' && status !== 'notProvided';

export function statusFor(requirement: Requirement, file: UploadedPdf | undefined, expiry: string | undefined, deadline: string): Status {
  if (!file) return requirement.mandatory ? 'missing' : 'notProvided';
  if (requirement.has_expiry) {
    if (!expiry || !validDate(expiry)) return 'expiryNeeded';
    if (expiry < deadline) return 'expired';
  }
  return 'ok';
}

export function availableFor(requirementId: string, file: UploadedPdf, matches: Matches, files: UploadedPdf[]): boolean {
  return !Object.entries(matches).some(([id, fileId]) => id !== requirementId && files.find(item => item.id === fileId)?.hash === file.hash);
}

export function review(data: TenderRequirements, files: UploadedPdf[], matches: Matches, expiries: Expiries) {
  return data.requirements.map(requirement => {
    const file = files.find(item => item.id === matches[requirement.id]);
    return { requirement, file, status: statusFor(requirement, file, expiries[requirement.id], data.tender.submission_deadline) };
  });
}

export function assertReady(data: TenderRequirements, files: UploadedPdf[], matches: Matches, expiries: Expiries) {
  const rows = review(data, files, matches, expiries);
  if (rows.some(row => blocking(row.status))) throw new Error('blocking');
  const hashes = rows.flatMap(row => row.file ? [row.file.hash] : []);
  if (new Set(hashes).size !== hashes.length) throw new Error('duplicate');
  return rows;
}
