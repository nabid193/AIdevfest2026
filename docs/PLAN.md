# Work plan

Status vocabulary: READY = environment prepared; PENDING = acceptance evidence is incomplete, whether or not code is implemented; VERIFIED = evidence exists for the listed checks. Do not mark a phase done based only on code being written.

| Part | Scope | Acceptance gate | Current status |
| --- | --- | --- | --- |
| 0. Environment and evidence | Toolchain, dependency lock, source map, sample inventory, test harness | Types, sample tests and static build pass; preview checked | VERIFIED locally; delivery items below pending |
| 1. Requirements import | Tender JSON parsing, schema checks, sorted requirements; bilingual message foundation | Official JSON loads; required metadata shown; malformed input handled without destroying valid state | VERIFIED: 58 total tests; browser import, language switch, rejection/recovery |
| 2. PDF intake | Multiple selection, file list, page counts, removal, limits, content hashes | Official PDFs accepted; PNG rejected; exact duplicate pair marked; limits enforced; scanned PDF counted | VERIFIED locally on the official sample: selected 10 PDFs at once; names and page counts appeared; duplicate pair was marked; PNG rejection was clear; removing a file updated the list. 30-file/50-MB boundary checks are unit-tested, not manually exercised in the browser. |
| 3. Matching and checklist | One-to-one matching/unmatching; expiry inputs; pure status rules | Five statuses follow the source table; deadline equality accepted; supplied optional invalid file blocks; changes update immediately | VERIFIED locally on the official sample: unique matches, disabled duplicate-content choices, unmatch/rematch, Missing/Not provided/Expiry date needed/Expired/OK, before-deadline and same-day expiry, and Generate disable/enable behavior exercised in the browser. Domain boundary tests also pass. |
| 4. PDF package | English cover, ordered original pages, footer space, total count and download | Official resolved pack is 16 pages; inspect every page and verify source order/content/footer; correct filename | VERIFIED locally on the official sample: browser generated and downloaded `T-2026-0417_Package.pdf`; Poppler reported 16 pages; a 16-page visual contact sheet confirmed order and footers, with full-size inspection of the cover, representative source pages, and the scanned declaration. Footer space did not cover visible source content. Public-host behavior remains pending under Part 6. |
| 5. End-to-end usability | Bangla/English completion flow, keyboard controls, clear errors, responsive layout | Actual browser workflow works in both languages; no document upload network requests; all principal strings covered | PENDING — desktop sample workflow and error messages exercised in English; the rendered interface switched to Bangla with document names translated. Full package generation in Bangla, responsive/mobile inspection, and a browser network audit remain pending. |
| 6. Delivery | Generated official output, screenshots, README, commits, public static hosting | Live site checked signed out; deployed source matches recorded commit; submission fields complete | PENDING |
| 7. Optional extras | Index, signature, CSV, saved work, auto-match, Bangla PDF, bad-file handling, optional AI | Only after mandatory workflow passes; preserve all core acceptance criteria | CSV export, malformed-PDF messaging, optional PNG/JPEG cover logo, and Bengali-font PDF support are implemented. The logo and malformed-file handling have sample checks; Bengali PDF text has a generation test but no visual review. Index, signature placement, save/reopen, auto-match, and AI help are not implemented. |

## Planned code boundaries

- `app/src/features/requirements/`: parse and validate imported JSON.
- `app/src/features/documents/`: browser File intake, PDF loading, hashing, lifecycle.
- `app/src/domain/`: pure matching and status calculations.
- `app/src/features/package/`: browser PDF creation and download.
- `app/src/i18n/`: English and Bangla dictionaries.
- `app/src/components/`: UI connected to domain behavior.
- `tests/`: sample fixtures referenced in place, plus domain/integration tests as features are built.

Requirements parsing, PDF intake, matching/status rules, package generation, optional cover-logo upload, and the bilingual workflow are implemented. `pnpm.cmd check` passes (75 tests, type checks, and static build). Parts 2–4 are verified locally against the official sample. Part 5 still needs the remaining browser checks listed above; the generated bundle has a large JavaScript chunk warning from pdf-lib/font embedding. Production still needs an actual static-host check.

## Milestone checkpoints

Aim for working import/intake by the first 30-minute checkpoint, matching/checklist and initial deployment by the second, then PDF verification and final delivery before T+90. Confirm actual organizer timing; do not infer remaining contest time from file timestamps. Setup commit does not replace the three contest-time commits.

## Remaining setup dependencies

- Git author name and user-provided email are configured.
- Git CLI push authentication was verified after correcting the unpublished setup commit to use the GitHub privacy email.
- Public static deployment is not configured or live yet.
- Participant registration number and final live URL for the README/submission.
