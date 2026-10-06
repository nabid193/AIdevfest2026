# Verification record

Environment setup checked on 6 October 2026. These are setup results, not acceptance of a completed tender application.

## Passed

- Node.js v24.19.0 and pnpm 11.19.0 available; exact dependencies installed and lockfile created.
- `pnpm.cmd check`: strict app/tooling type checks, 14 Vitest checks, production build.
- Supplied JSON/document inventory and SHA-256 hashes match captured source evidence.
- All ten supplied PDFs load with independently verified page counts via pdf-lib.
- Both experience certificate filenames contain identical bytes.
- Supplied company logo is rejected by the PDF loader.
- Image-only declaration can be loaded, serialized in memory and reopened with one page. Content/appearance preservation in the final app still requires visual verification.
- Built setup page inspected in the in-app browser at http://127.0.0.1:4173; English and Bangla text rendered; no captured browser warnings/errors.
- GitHub connector found public nabid193/AIdevfest2026 and reported push/admin access. Git CLI authentication was not tested.

## Execution limitations encountered and resolved

- Registry access was blocked in sandbox; dependency installation completed with approval.
- Initial pnpm store location differed across execution contexts; project-local store configured and installation reconciled.
- Vite's Windows subprocess failed with EPERM in sandbox; complete checks passed outside sandbox with approval.

## Not yet verified / implemented

- Any business feature or end-to-end user workflow.
- Standalone latest Chrome acceptance (the setup page was checked in the in-app browser).
- Actual exported package, cover, footers, page ordering and visual integrity.
- Complete bilingual UI, input validation, upload limits and domain edge cases.
- Browser network audit during document processing.
- Git CLI push authentication (report separately after the push succeeds).
- Public deployment, commit/deployment match, contest timing eligibility and final submission.

Do not mark these complete until evidence is recorded. A passing test suite cannot guarantee absence of mistakes or hallucinated assumptions.

## External PowerShell launcher

The user's normal PowerShell did not have pnpm on PATH. Added project.cmd to locate bundled Node/pnpm and adjust only its child-process PATH. Verified pnpm 11.19.0 with PATH reduced to Windows system directories; Vite started successfully outside the sandbox and returned HTTP 200. The verification server was then stopped so the user can start it normally.

## Push result

GitHub rejected the initial setup push with GH007 because its commit author email is protected by the user's email-privacy setting. Setup commit 1e52ad1 exists locally; remote publication has not succeeded. Keep email privacy protection enabled; resolve the unpublished commit's author address deliberately before retrying.

## Git identity follow-up

User supplied their Git email and confirmed the target URL. Local author identity is configured; origin/main was fetched successfully. The existing GitHub initial commit is retained as the parent of setup work. No force push or history replacement is needed.
