# Prompt log

## Environment preparation

User: "Divide the project into parts at setup the environment with plugins and whatever we require so that we don't hallucinate or make anything wrong"

Scope: split Tender Document Package Builder into source-backed phases, prepare toolchain/plugins and verification. No business-feature implementation, public deployment or Git push in this setup step.

Earlier source review: "Check again everything we have to work on frontend only cross check every folder and the rules again after that we'll proceed ."

Earlier repository identity: Nabid Morshed; nabid193; AIdevfest2026; user says organizers approved repository name.

Append actual prompts for each subsequent milestone. Do not replace them with invented prompts or fabricate commit timestamps.

## Git connection follow-up

User supplied the confirmed repository URL and Git author email to finish the pending Git setup. Configure the provided identity, preserve the existing remote initial commit, commit the verified environment and push to origin/main. The email is stored in Git configuration/commit metadata, not duplicated in application source.

## PowerShell launcher correction

User reported: "pnpm.cmd : The term 'pnpm.cmd' is not recognized as the name of a cmdlet, function, script file, or operable program."

Added a project-local launcher and updated the README. Verified it can find Node/pnpm without the Codex PATH and start the development server. No machine-wide PATH changes.

## Part 1

User: "Start part 1"

Agreed scope: import requirements.json, tender details, requirements ordered by order, English/Bangla switching, and clear validation errors that preserve a previously valid import. Built these features, added sample-derived validation tests and verified actual browser import/language/error/recovery. Later parts remain pending.

## Continue project implementation

User: "We were building a frontend web complete the project"

Scope: continue the browser-only Tender Document Package Builder through its mandatory implementation phases. Implemented intake, checklist matching/statuses, and package generation were reviewed; `pnpm.cmd check` passed (73 tests, type checks, static build). The official sample was exercised in the local browser for import, intake, duplicate marking, PNG rejection, page counts, matching, and the 16-page expected total. Full date-field automation, generated PDF download and visual page review, responsive/network audit, public deployment, submission screenshot/output artifacts, and external delivery verification were not established in this turn; see `docs/PLAN.md`. No push or deployment was performed.

## Add company cover logo and shorten privacy copy

User: "Finalize the project add logo from the folder remove extra words like \"Your tender information is read locally in this browser.\" we'll upload the website after that"

Scope: add an optional local PNG/JPEG logo picker that previews and embeds a selected image on the English cover; remove the specified long sidebar sentence in both languages. Use the supplied `company_logo.png` through the picker, not a hard-coded production default. Run the project check and prepare the app for the user's later upload; do not publish it in this step.

## Fix step navigation before requirements import

User: "for some reason i can't move to [Upload documents](http://127.0.0.1:4173/#documents)\n\n1. 3[Match & review](http://127.0.0.1:4173/#review)\n2. 4[Create package](http://127.0.0.1:4173/#package)"

Scope: keep desktop step navigation visible while scrolling, track the active section, and make the workflow navigation lead to the requirements import card until requirements are loaded. Explain the prerequisite in English and Bangla, then use real section links after import. Do not deploy or upload the website.

## Check against the problem statement

User: "check if my website follows them or not" (followed by the acceptance criteria pasted in that turn for Sections 4.1–4.9, 5, 6, and optional 7).

Scope: compare the implementation, automated checks, local browser workflow, and generated sample PDF against the supplied criteria. Record verified behavior and remaining checks; do not deploy the site.
