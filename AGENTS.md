# Working agreement

## Scope and evidence

This is the browser-only Tender Document Package Builder in `ViveCoding Problem/AIDevFest-ViveCoding ProblemStatement.pdf`. Read `docs/REQUIREMENTS.md`, `docs/PLAN.md`, and `docs/DECISIONS.md` before feature work. Smart Escape and the root README_START_HERE.txt describe a different practice task; do not implement their requirements.

User says organizers approved repository name `nabid193/AIdevfest2026`. Do not repeatedly ask to rename it. The user authorized Part 1 (requirements import). Implement subsequent parts only when the user proceeds.

Preserve the supplied PDFs, JSON, README.txt, PNG, and their filenames. Never alter evidence or dates to make a sample pass. Do not hard-code application behavior to the sample. Fixture-specific assertions are confined to tests.

## Architecture

All runtime file reading, hashing, validation, page counting, PDF assembly and downloading happen in the browser. No app backend, serverless functions, remote storage or upload service. Node is for local tools/tests/build only. Deploy `dist/` only; never deploy the repository or node_modules.

Keep pure status/matching rules separate from React components and PDF operations. Treat imported JSON as unknown until validated. Use translation keys for every principal interface message; use title_en/title_bn from input. The mandatory PDF cover remains English.

## Verification

Each phase has source references and acceptance criteria in docs. Implement mandatory features before bonuses. Use official library docs and installed type declarations instead of guessing APIs. Record ambiguous requirements in DECISIONS.md; never present an assumption as an organizer rule.

Run `pnpm.cmd check` after meaningful implementation changes. Add tests for business boundaries when implementing those rules, not tests that only mirror implementation. Use official sample documents; any new test fixtures require consideration of the rulebook's sample-only restriction. Existing setup tests only inspect supplied files and load/serialize supplied PDFs in memory.

Passing setup tests does not establish app correctness. Before completion, exercise the actual browser workflow, inspect the downloaded PDF visually (including scanned content and footers), verify page order/count and bilingual states, then check the deployed site. Keep a truthful list of pending checks.

## Delivery

Track prompts in docs/PROMPTS.md. Commit messages need change summary plus actual AI prompt, or Manual edit. Minimum three contest-time commits, at least one every 30 minutes. Never rewrite pushed history. Never fabricate timing or claim a deployment is eligible without verified organizer timing. Public HTTPS deployment must match the final eligible commit.

Git name: Nabid Morshed. Git email remains user-supplied; do not invent one. Do not push, deploy or claim setup completion beyond verified results. Do not stage unrelated supplied files automatically. No secrets in source, env values, logs or commits.
