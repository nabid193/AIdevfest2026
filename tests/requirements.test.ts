import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { parseRequirements, RequirementsImportError, type ImportErrorCode, type TenderRequirements } from '../app/src/features/requirements/parseRequirements';

// All cases derive from the organizer-provided fixture, without modifying it on disk.
const source = await readFile(new URL('../ViveCoding Problem/problem-pack/sample-pack/requirements.json', import.meta.url), 'utf8');
const sample = (): TenderRequirements => JSON.parse(source) as TenderRequirements;
function fails(value: unknown, code: ImportErrorCode, field?: string) {
  try { parseRequirements(JSON.stringify(value)); throw new Error('Unexpected acceptance'); }
  catch (error) {
    expect(error).toBeInstanceOf(RequirementsImportError);
    expect((error as RequirementsImportError).code).toBe(code);
    if (field !== undefined) expect((error as RequirementsImportError).field).toBe(field);
  }
}
describe('requirements import', () => {
  it('loads every tender field and all ten bilingual requirements from the official file', () => {
    expect(parseRequirements(source)).toEqual(sample());
    expect(parseRequirements(source).requirements.filter(r => r.mandatory)).toHaveLength(8);
  });
  it('accepts a UTF-8 BOM', () => expect(parseRequirements('\uFEFF' + source)).toEqual(sample()));
  it('orders reversed input numerically without changing the input object', () => {
    const data = sample(); data.requirements.reverse();
    const before = JSON.stringify(data);
    expect(parseRequirements(before).requirements.map(r => r.id)).toEqual(sample().requirements.map(r => r.id));
    expect(JSON.stringify(data)).toBe(before);
  });
  it('accepts gaps/equal order values and preserves the original order of ties', () => {
    const data = sample(); data.requirements = data.requirements.slice(0, 2).reverse();
    data.requirements.forEach(r => { r.order = 12; });
    expect(parseRequirements(JSON.stringify(data)).requirements.map(r => r.id)).toEqual(['R02', 'R01']);
  });
  it.each(['', source.slice(0, -5)])('rejects malformed JSON', input => expect(() => parseRequirements(input)).toThrowError(RequirementsImportError));
  it.each([null, [], true])('rejects non-object roots', value => fails(value, 'objectExpected', '$'));
  it('requires a tender section', () => fails({ requirements: sample().requirements }, 'objectExpected', 'tender'));
  it.each(['tender_id', 'title', 'procuring_entity', 'bidder', 'submission_deadline'] as const)('rejects blank tender %s', key => {
    const data = sample(); data.tender[key] = '  '; fails(data, 'textExpected', `tender.${key}`);
  });
  it.each(['2026-02-29', '2026-04-31', '2026-13-01', '2026-00-10', '2026-10-00', '20/10/2026', '2026-10-20T00:00:00Z', '0000-01-01'])('rejects invalid deadline %s', date => {
    const data = sample(); data.tender.submission_deadline = date; fails(data, 'dateExpected');
  });
  it.each(['2024-02-29', '2000-02-29', '2026-10-20'])('accepts valid calendar deadline %s', date => {
    const data = sample(); data.tender.submission_deadline = date;
    expect(parseRequirements(JSON.stringify(data)).tender.submission_deadline).toBe(date);
  });
  it('rejects the non-leap century rollover', () => { const data = sample(); data.tender.submission_deadline = '1900-02-29'; fails(data, 'dateExpected'); });
  it.each([[], null, {}])('requires a non-empty requirements array', requirements => fails({ ...sample(), requirements }, 'listExpected'));
  it('rejects a non-object requirement', () => fails({ ...sample(), requirements: [null] }, 'objectExpected', 'requirements[0]'));
  it('rejects duplicate IDs', () => { const data = sample(); data.requirements.push({ ...data.requirements[0]! }); fails(data, 'duplicateId', 'requirements[10].id'); });
  it.each(['id', 'title_en', 'title_bn'] as const)('requires %s text', key => {
    const data = sample(); data.requirements[0]![key] = ''; fails(data, 'textExpected', `requirements[0].${key}`);
  });
  it.each([0, -1, 1.5, '1', null, Number.MAX_SAFE_INTEGER + 1])('rejects invalid order %s', order => {
    const data = sample(); fails({ ...data, requirements: [{ ...data.requirements[0], order }] }, 'orderExpected');
  });
  it.each(['mandatory', 'has_expiry'])('does not coerce %s from string or number', key => {
    const data = sample();
    for (const invalid of ['false', 0, null, undefined]) fails({ ...data, requirements: [{ ...data.requirements[0], [key]: invalid }] }, 'booleanExpected', `requirements[0].${key}`);
  });
  it('accepts unknown extension fields while returning only the known contract', () => {
    expect(parseRequirements(JSON.stringify({ ...sample(), extension: true }))).toEqual(sample());
  });
});
