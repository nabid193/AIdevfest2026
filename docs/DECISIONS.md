# Decisions, assumptions and open questions

## Chosen for this setup (engineering choices, not organizer requirements)

- React + strict TypeScript + Vite for a static frontend. app/ is the Vite root; original reference PDFs are outside it. Build only dist/ for hosting.
- pdf-lib for browser PDF operations. It can load/count pages without PDF.js; add PDF.js only if an actual preview requirement makes it useful.
- Vitest for domain/integration checks. Setup tests inspect only provided samples and exercise PDF serialization in memory; they do not claim the future UI is correct.
- pnpm 11.19.0 is available in this environment. Exact dependency versions and pnpm-lock.yaml make installs repeatable. No machine-wide npm installation required here.
- No external AI/API feature, remote storage, account login or database is needed for mandatory functionality.
- No new Codex plugin needed: GitHub plugin was verified installed and able to read the public target repo with push/admin permissions. PDF and browser tools are already available. Connector permissions do not prove Git CLI authentication.

## Important implementation decisions to resolve explicitly

- 50 MB: statement does not define decimal/binary units. Conservative planned interpretation is 50,000,000 bytes of retained PDF uploads. Document this assumption and adjust if organizer clarifies.
- Retain duplicate uploads with visible markers and count each retained file toward limits; prevent matching identical content twice. The statement does not require deleting duplicates or blocking generation for an unused duplicate.
- Do not silently replace occupied matches. The interface should expose reassignment clearly and reset file-specific expiry on replacement unless the user re-enters it.
- Company branding is an optional cover enhancement: offer a separate local PNG/JPEG picker, validate image bytes, preview/remove the selection, and embed it on the English cover. Do not count it as a tender PDF or hard-code the supplied sample logo; users choose an image for each tender session.
- Footer safety: reserve actual space when composing pages, preserving source content and orientation. Simply drawing text over existing bottom margins is insufficient.
- Unseen tender metadata may exceed one cover page. Plan readable fitting while preserving P6.1's single first-page cover. Very long fields/large requirement counts have no stated JSON limits; do not invent organizer constraints.
- Basic cover is English. Use of arbitrary Unicode metadata may require an embedded licensed font; decide during PDF phase rather than claiming standard PDF fonts cover all scripts.
- Invalid/duplicate requirement IDs or invalid dates need clear import errors; the statement does not provide a complete formal JSON schema. Validation policy must be documented separately from source facts.

## Source inconsistencies / missing details

- Problem P10 says marks follow rulebook Section 11, but provided V11 is Code Ownership and License. No numeric scoring rubric is supplied; do not invent marks.
- General rules disallow late submissions, but G11.2 gives precedence to competition-specific instructions and V9.4 specifies a form-only late window.
- User reports approval of repository name AIdevfest2026; no rename required.
- Actual organizer-announced T+0/deadline or extensions have not been provided in this chat. Do not claim contest eligibility based on the cover's clock times or file timestamps.
- Git privacy email is configured and CLI push was verified. Registration number remains to be confirmed. Public deployment remains pending.

## Official implementation references

- https://vite.dev/guide/ — local server/static build and React template.
- https://pdf-lib.js.org/ — browser-compatible PDF loading/copying/creation.
- https://vitest.dev/guide/ — test runner setup.
- https://www.typescriptlang.org/tsconfig/strict.html — strict type checking.

Consult installed types and current official docs for concrete APIs. No plugin can guarantee an error-free implementation; acceptance evidence is required.

## Part 1 import policy

- Require an object with a tender object and non-empty requirements array. Every documented string must be non-blank; booleans must be true/false without coercion; IDs must be unique; order must be a positive safe integer. This is our validation policy for the documented format, not an organizer-issued formal schema.
- Check real calendar dates in exact YYYY-MM-DD format (years 0001–9999), including leap-year rules. Display dates with explicit UTC to avoid local timezone shifts.
- Preserve input strings and case-sensitive IDs. Ignore extra properties for forward compatibility. Accept gaps and equal order values; sort numerically and preserve original order within ties because no tie rule is supplied.
- Accept a UTF-8 BOM. Parse file contents locally with File.text(); do not rely on MIME labels. Never upload imported JSON. A failed replacement leaves the previous valid tender unchanged, and the same file can be selected again.
- Imported metadata stays as provided; principal UI and requirement titles switch language. User-chosen filenames/IDs/schema field paths are not translated.
- The current import lives in memory; refreshing clears it. Persistence is optional and not implemented.
- Tests use the original sample and in-memory mutations for invalid fields/date boundaries. No unrelated datasets or modifications to the organizer's files are used.
