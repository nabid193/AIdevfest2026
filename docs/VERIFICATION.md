# Verification record

## Current independent review — 8 November 2026

### Confirmed by inspecting the uploaded source archive

- The archive contains the complete application source under `app/`, project documentation under `docs/`, tests under `tests/`, and the original problem statement and fictional sample pack under `ViveCoding Problem/`.
- The application source includes requirements JSON parsing, PDF intake, page counting, SHA-256 duplicate detection, one-to-one matching, expiry validation, the five required statuses, package blocking, PDF generation, CSV export, an optional cover logo and English/Bangla interface messages.
- The supplied requirements file contains 10 requirements for tender `T-2026-0417`, with a 20 October 2026 deadline.
- The supplied sample inventory contains 11 assets: 10 PDFs and one PNG logo. The selected eight valid package documents total 15 source pages; the expected basic package is one cover plus 15 source pages (16 pages).
- The two experience certificate PDFs are byte-identical. The supplied PNG logo is separate from PDF intake and can be selected by the cover-logo feature.
- The Vercel deployment target is static: Vite's configured output directory is `dist/`. No application backend is configured.

### Node and package-manager compatibility update

- The project now targets Node.js 24.x. `.nvmrc` and `.node-version` select the 24 line, `package.json` declares `24.x`, and pnpm's engine baseline is `24.0.0` with `engineStrict: true`.
- The package manager remains pinned to `pnpm@11.19.0`; the dependency lockfile is unchanged.
- The project uses `pnpm-workspace.yaml` for pnpm 11 workspace settings (`nodeVersion`, `engineStrict`, `saveExact` and `storeDir`).
- The GitHub Actions workflow reads `.nvmrc`, installs pnpm 11.19.0 and runs `pnpm check`.
- The user reported that `pnpm install --frozen-lockfile` completed successfully on their Mac: 55 packages were installed and pnpm reported version 11.19.0.
- The user's first `pnpm check` failed in `app/src/components/Workflow.tsx`: `LogoError` was declared inside the `try` block and then referenced from `catch`, so it was out of scope; TypeScript also reported the caught error as `unknown`. This release fixes the issue with a narrow structural guard for the two supported logo error codes.
- The user's `nvm install 24` command did not run because `nvm` is not installed in their shell. README instructions now include the official Node.js 24 macOS installer as an alternative; the user must confirm `node --version` reports `v24.x` before the final Node 24 checks.

### Limited checks reproduced in this environment

- The globally available TypeScript compiler (`tsc` 5.8.3) compiled `parseRequirements.ts` and `checklist.ts` with strict, no-unused checks: passed.
- Independent Node assertions against the compiled domain modules verified the official 10-requirement JSON, eight mandatory/two optional counts, date boundaries, invalid JSON rejection, initial statuses, expiry-needed/expired/OK transitions and duplicate-match prevention: passed.
- Python/pypdf checks verified the sample requirements hash, every sample asset's byte count and SHA-256 hash, and the page counts recorded in the sample manifest: passed.
- JSON and YAML configuration parsing: passed.

### Not independently reproduced in this environment

- Full application TypeScript type checks.
- Full Vitest test suite.
- Production Vite build and preview.
- Full interactive browser workflow in English and Bangla.
- PDF generation and visual review from the current source build.
- Responsive and keyboard testing on the current build.
- Browser network audit proving no document data is sent to a server.
- Public Vercel deployment and signed-out live-site verification.

The current model execution environment cannot reproduce the user's Mac dependency installation. The user's successful install is recorded as user-reported evidence, not independently reproduced here. The corrected logo error handler has not yet been rerun through the user's TypeScript check. No full typecheck, Vitest pass or production build is claimed until the user reruns the commands on Node.js 24.x.


## Historical project-session notes (not re-run during the current review)

The prior `docs/PLAN.md` and `docs/PROMPTS.md` recorded that the official sample workflow had been exercised locally for requirements import, PDF intake, matching, expiry/status handling and 16-page package generation. The prior plan reported 75 tests, strict type checks and a static build passing. The verification file in the uploaded archive reported 58 tests and only Part 1 complete. Because these historical notes are inconsistent and the current environment could not reproduce the commands, treat them as historical evidence only; the release gate is to rerun the current repository's `pnpm check` on Node.js 24.x.

## Required release checks

1. Install exactly from the lockfile on Node.js 24.x and pnpm 11.19.0: `pnpm install --frozen-lockfile`.
2. Run `pnpm check` and retain the terminal output.
3. Run `pnpm build` and `pnpm preview`.
4. In Chrome, import the official `requirements.json`; confirm all 10 requirements, 8 mandatory and 2 optional.
5. Add the official PDFs. Confirm page counts, rejection of `company_logo.png` as a PDF, and duplicate marking of `experience_cert.pdf` and `experience_cert (1).pdf`.
6. Match the eight valid documents, leave the two optional requirements unprovided, and enter expiries `2027-06-30` for R01 and `2026-12-31` for R04. Confirm all included rows are OK and package generation is enabled.
7. Test Missing, Not provided, Expiry date needed, Expired and OK, including an expiry equal to the submission deadline.
8. Generate the package from the app. Confirm filename `T-2026-0417_Package.pdf`, 16 pages, cover fields, source page order, scanned declaration visibility and footer on every page without covering source content.
9. Repeat the main workflow in Bangla. Visually inspect the PDF's Bengali glyph shaping if Bengali tender metadata is used.
10. Test a narrow viewport, keyboard focus, removal/rematching, malformed and password-protected PDFs, and CSV export.
11. Inspect the browser Network panel while importing and processing documents; verify that the PDFs, JSON and logo are not uploaded.
12. Save a final status screenshot in `screenshots/` and the actual app-generated sample PDF in `output/`.
13. Deploy only `dist/` to Vercel, then verify the public HTTPS site in a signed-out Chrome session.

## Submission fields still to complete

- Registration number: not supplied in the reviewed files.
- Public live URL: not deployed/verified in this review.
- Final commit ID: must be copied from the actual GitHub release commit.
- Generated output PDF and final status screenshot: not present in the uploaded archive.

The original sample data is fictional according to its included README. Do not replace or modify the supplied source evidence to make a test pass.
