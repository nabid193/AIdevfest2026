# Verification record

Last milestone: Part 1, requirements import, 6 October 2026. Later application parts are not complete.

## Passed

- Node.js v24.19.0, pnpm 11.19.0; exact dependencies and lockfile.
- `pnpm.cmd check`: strict app/tooling TypeScript checks, 58 tests, static production build.
- 14 setup tests verify supplied file hashes, all PDF page counts, duplicate bytes, PNG rejection by PDF loader, and scanned-PDF load/save compatibility.
- 44 requirements tests cover the official file, BOM, numeric stable sorting, tied/gapped order, malformed JSON, wrong root/section types, blank fields, real/leap calendar dates, empty requirements, duplicate IDs, invalid order, strict booleans, and extension fields. Tests derive from the supplied sample in memory; original files are unchanged.
- Actual in-app browser file chooser imported official requirements.json: 10 rows, eight mandatory, two optional, three expiry flags, correct five tender fields and 20 October 2026 deadline.
- Language switch translated navigation, instructions, table labels, requirement titles, numbers, dates and existing import errors without reimporting.
- Invalid replacement using the supplied README.txt displayed an error in Bangla and English while retaining all ten original rows and tender details. Re-selecting the same valid JSON cleared the error and restored success state.
- No captured browser warnings/errors during the tested flow.
- Desktop and 390-pixel viewport inspected. The narrow page had no horizontal document overflow; the table has a separate horizontal scrolling region. Viewport restored after testing.
- English/Bangla full-page evidence saved under screenshots/part1-requirements-en.jpg and screenshots/part1-requirements-bn.jpg. These show Part 1 requirements, not the future document-status checklist required for final submission.
- Source inspection: import uses browser File.text() and JSON parsing only; no upload endpoint, fetch call, external font, API, or persistence was introduced.
- GitHub CLI push was verified for setup/launcher commit cf344ad using the user's GitHub privacy address. Public deployment is still pending.

## Environment notes

Registry access and Vite Windows subprocesses required sandbox approval. project.cmd makes bundled Node/pnpm available to a normal PowerShell process without permanent PATH changes. The local development server uses port 5173; production preview uses 4173.

## Still pending

- PDF intake, matching/unmatching, expiry/status engine, duplicate matching restrictions, upload limits, actual PDF generation/download.
- All later bilingual workflows, keyboard/end-to-end acceptance, browser network audit during PDF processing.
- Visual inspection of exported source content, cover, footers and page ordering.
- Standalone latest Chrome and final deployed-site verification (current browser inspection uses the in-app browser).
- Public deployment, final output PDF, document-status screenshot, registration number, contest eligibility and final submission.

The import is in-memory only; refresh clears it. Schema validation choices are documented in DECISIONS.md. Passing these checks is evidence for Part 1, not a guarantee that future functionality is correct.
