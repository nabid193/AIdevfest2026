# Work plan

Status vocabulary: READY = environment prepared; PENDING = no feature implemented; VERIFIED = evidence exists. Do not mark a phase done based only on code being written.

| Part | Scope | Acceptance gate | Current status |
| --- | --- | --- | --- |
| 0. Environment and evidence | Toolchain, dependency lock, source map, sample inventory, test harness | Types, sample tests and static build pass; preview checked | VERIFIED locally; delivery items below pending |
| 1. Requirements import | Tender JSON parsing, schema checks, sorted requirements; bilingual message foundation | Official JSON loads; required metadata shown; malformed input handled without destroying valid state | VERIFIED: 58 total tests; browser import, language switch, rejection/recovery |
| 2. PDF intake | Multiple selection, file list, page counts, removal, limits, content hashes | Official PDFs accepted; PNG rejected; exact duplicate pair marked; limits enforced; scanned PDF counted | PENDING |
| 3. Matching and checklist | One-to-one matching/unmatching; expiry inputs; pure status rules | Five statuses follow the source table; deadline equality accepted; supplied optional invalid file blocks; changes update immediately | PENDING |
| 4. PDF package | English cover, ordered original pages, footer space, total count and download | Official resolved pack is 16 pages; inspect every page and verify source order/content/footer; correct filename | PENDING |
| 5. End-to-end usability | Bangla/English completion flow, keyboard controls, clear errors, responsive layout | Actual browser workflow works in both languages; no document upload network requests; all principal strings covered | PENDING |
| 6. Delivery | Generated official output, screenshots, README, commits, public static hosting | Live site checked signed out; deployed source matches recorded commit; submission fields complete | PENDING |
| 7. Optional extras | Index, signature, CSV, saved work, auto-match, Bangla PDF, bad-file handling, optional AI | Only after mandatory workflow passes; preserve all core acceptance criteria | PENDING |

## Planned code boundaries

- `app/src/features/requirements/`: parse and validate imported JSON.
- `app/src/features/documents/`: browser File intake, PDF loading, hashing, lifecycle.
- `app/src/domain/`: pure matching and status calculations.
- `app/src/features/package/`: browser PDF creation and download.
- `app/src/i18n/`: English and Bangla dictionaries.
- `app/src/components/`: UI connected to domain behavior.
- `tests/`: sample fixtures referenced in place, plus domain/integration tests as features are built.

Requirements parsing and the bilingual interface are implemented. PDF intake, domain matching, PDF generation and other folders remain planned boundaries.

## Milestone checkpoints

Aim for working import/intake by the first 30-minute checkpoint, matching/checklist and initial deployment by the second, then PDF verification and final delivery before T+90. Confirm actual organizer timing; do not infer remaining contest time from file timestamps. Setup commit does not replace the three contest-time commits.

## Remaining setup dependencies

- Git author name and user-provided email are configured.
- Git CLI push authentication was verified after correcting the unpublished setup commit to use the GitHub privacy email.
- Configure public static deployment when implementation starts; it is not live yet.
- Participant registration number and final live URL for the README/submission.
