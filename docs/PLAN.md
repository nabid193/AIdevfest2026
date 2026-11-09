# Work plan and release status

Status vocabulary:
- **Implemented** means the source code for the feature is present.
- **Historically verified** means a previous project session recorded the listed test or browser evidence.
- **Pending current verification** means the evidence must be reproduced against the current source and release build before calling the project finished.
- **Complete** is reserved for a feature whose current acceptance checks have actually passed.

| Part | Scope | Current source status | Release gate |
| --- | --- | --- | --- |
| 0. Environment and evidence | Toolchain, dependency lock, sample inventory and test harness | Implemented. The project targets Node.js 24.x (local pin 24) and pnpm 11.19.0; the Node 24 runtime is selected consistently for local, CI and Vercel builds. | Re-run install, checks and build on Node.js 24.x. |
| 1. Requirements import | JSON parsing, schema checks, sorted requirements and bilingual UI | Implemented. Previous notes record browser import, language switching, invalid-file handling and recovery. | Re-run on the current release build. |
| 2. PDF intake | Multi-file upload, page counts, removal, size/count limits, content hashes and error handling | Implemented. Previous notes record the official sample intake, duplicate detection and PNG rejection. | Re-run sample workflow and boundary tests. |
| 3. Matching and checklist | One-to-one matching, expiry dates, five statuses and duplicate restrictions | Implemented. Previous notes record matching, unmatching, expiry/status changes and generation blocking. | Re-run all status transitions and duplicate cases. |
| 4. PDF package | English cover, ordered original pages, footer on every page and download | Implemented. Previous notes record a 16-page sample output and visual inspection. | Rebuild from the current source, inspect every page and verify the download name. |
| 5. End-to-end usability | English/Bangla workflow, keyboard access, errors, responsive layout and local-only processing | Implemented in source. Prior notes identify remaining Bangla package, mobile and network-audit checks. | Exercise both languages, narrow viewport, keyboard flow and browser network panel. |
| 6. Delivery | README, output PDF, status screenshot, GitHub and public static hosting | Documentation and Vercel configuration prepared. Output PDF, final status screenshot, live URL and final deployment verification are not yet supplied. | Generate artifacts in the app, commit the release, deploy `dist/`, and check the live URL signed out. |
| 7. Optional extras | CSV, cover logo, bad-PDF messaging, Bengali font, index, signature, saved work, auto-match and AI | CSV export, optional PNG/JPEG cover logo and bad-file messaging are implemented. Bengali font embedding is implemented but needs visual review. Index, signature placement, save/reopen, auto-match and AI help are not implemented. | Optional features are not release blockers; do not add them at the expense of main-task verification. |

## Architecture boundaries

- `app/` is the Vite application root. Runtime file reading, hashing, validation, page counting, PDF assembly and downloading happen in the browser.
- `app/src/features/requirements/` parses and validates imported JSON.
- `app/src/features/documents/` reads, validates, counts and hashes browser-selected PDFs.
- `app/src/domain/` contains matching and status rules independent of React.
- `app/src/features/package/` creates the PDF package in the browser.
- `app/src/i18n/` contains English and Bangla interface messages.
- `app/src/components/` connects the workflow UI to the domain and PDF features.
- `tests/` contains sample-integrity, parsing, status, intake and package integration tests.
- `ViveCoding Problem/` contains the original problem statement and fictional sample pack. Preserve these files and filenames.
- Vercel builds the static `dist/` directory only. Do not deploy the repository, source sample PDFs, tests or `node_modules/`.

## Current verification limitation

The project targets Node.js 24.x and pnpm 11.19.0. The user successfully installed all locked dependencies on their Mac. Their first `pnpm check` exposed a TypeScript scope error in the optional cover-logo error handler; that source issue is corrected in this release. The full typecheck, Vitest suite, production build, browser workflow and live deployment must still be rerun after selecting Node.js 24.x. See `VERIFICATION.md` for exact evidence. Do not interpret the source correction as a passing production build.

## Release sequence

1. Use Node.js 24.x and pnpm 11.19.0.
2. Run `pnpm install --frozen-lockfile` and `pnpm check`.
3. Run `pnpm build` and `pnpm preview`.
4. Exercise the official sample in current Chrome in English and Bangla.
5. Generate `T-2026-0417_Package.pdf` from the app and visually inspect the cover, every page, source order, scanned declaration and footer placement.
6. Save a screenshot showing the final document statuses in `screenshots/`.
7. Fill the registration number and live URL in README if required.
8. Commit and push the verified source; deploy the matching static build to Vercel.
9. Open the public HTTPS site in a signed-out browser and verify the same workflow.

The contest's original October 2026 deadline has passed. A later release can be a complete portfolio project, but must not be described as an on-time contest submission or an eligible contest-time deployment.
