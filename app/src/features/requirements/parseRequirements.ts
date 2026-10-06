export interface Tender {
  tender_id: string;
  title: string;
  procuring_entity: string;
  bidder: string;
  submission_deadline: string;
}
export interface Requirement {
  id: string;
  order: number;
  title_en: string;
  title_bn: string;
  mandatory: boolean;
  has_expiry: boolean;
}
export interface TenderRequirements { tender: Tender; requirements: Requirement[] }
export type ImportErrorCode = 'invalidJson' | 'objectExpected' | 'textExpected' | 'listExpected' | 'booleanExpected' | 'orderExpected' | 'dateExpected' | 'duplicateId' | 'readFailed';
export class RequirementsImportError extends Error {
  constructor(public readonly code: ImportErrorCode, public readonly field = '') {
    super(code);
    this.name = 'RequirementsImportError';
  }
}
function object(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new RequirementsImportError('objectExpected', field);
  return value as Record<string, unknown>;
}
function text(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new RequirementsImportError('textExpected', field);
  return value;
}
function flag(value: unknown, field: string): boolean {
  if (typeof value !== 'boolean') throw new RequirementsImportError('booleanExpected', field);
  return value;
}
// Calendar validation avoids timezone conversion and Date's automatic rollover.
function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  return year >= 1 && days !== undefined && day >= 1 && day <= days;
}
export function parseRequirements(source: string): TenderRequirements {
  let parsed: unknown;
  try { parsed = JSON.parse(source.replace(/^\uFEFF/, '')); }
  catch { throw new RequirementsImportError('invalidJson'); }
  const root = object(parsed, '$');
  const input = object(root.tender, 'tender');
  const tender: Tender = {
    tender_id: text(input.tender_id, 'tender.tender_id'),
    title: text(input.title, 'tender.title'),
    procuring_entity: text(input.procuring_entity, 'tender.procuring_entity'),
    bidder: text(input.bidder, 'tender.bidder'),
    submission_deadline: text(input.submission_deadline, 'tender.submission_deadline'),
  };
  if (!validDate(tender.submission_deadline)) throw new RequirementsImportError('dateExpected', 'tender.submission_deadline');
  if (!Array.isArray(root.requirements) || root.requirements.length === 0) throw new RequirementsImportError('listExpected', 'requirements');
  const ids = new Set<string>();
  const requirements = root.requirements.map((value: unknown, index): Requirement => {
    const path = `requirements[${index}]`;
    const entry = object(value, path);
    const id = text(entry.id, `${path}.id`);
    if (ids.has(id)) throw new RequirementsImportError('duplicateId', `${path}.id`);
    ids.add(id);
    if (typeof entry.order !== 'number' || !Number.isSafeInteger(entry.order) || entry.order < 1) throw new RequirementsImportError('orderExpected', `${path}.order`);
    return { id, order: entry.order,
      title_en: text(entry.title_en, `${path}.title_en`), title_bn: text(entry.title_bn, `${path}.title_bn`),
      mandatory: flag(entry.mandatory, `${path}.mandatory`), has_expiry: flag(entry.has_expiry, `${path}.has_expiry`),
    };
  });
  // Stable sorting preserves input order for equal order values.
  return { tender, requirements: requirements.sort((a, b) => a.order - b.order) };
}
