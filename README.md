# TenderDesk

**Tender Document Package Builder** — a browser-based tool for preparing a checked, correctly ordered PDF package for a tender submission.

Built by **Nabid Morshed**.

 #Vercel Link
 
 https://tenderdesk-nabid.vercel.app/
 
- GitHub: https://github.com/nabid193/AIdevfest2026
- Live website: _Add the Vercel URL after deployment._
- Registration number: _Add if required for your submission._

## What it does

TenderDesk helps an office user move from a tender's `requirements.json` file and a folder of PDFs to one combined package.

1. Import the tender requirements and view the tender details.
2. Add multiple PDF files and see each file's page count.
3. Identify files with identical contents, even when their filenames differ.
4. Match one PDF to each requirement, and change or remove a match when needed.
5. Enter expiry dates for documents that require them.
6. Review the status of every requirement before generating the package.
7. Generate and download one ordered PDF with an English cover page and a page footer.
8. Export the checklist as a CSV file.
9. Optionally add a company logo to the cover.
10. Switch the interface between English and Bangla.

## Privacy and limits

The application is frontend-only. Tender JSON, PDFs and the optional logo are read and processed in the browser; the app does not upload them to an application server or store them in a remote database. The working session is held in the current browser tab, so download the generated package before refreshing or closing the tab.

The app accepts up to **30 PDF files** with a combined size of **50,000,000 bytes (50 MB decimal)**. Password-protected, damaged and non-PDF files are rejected with an explanatory message. The company logo is selected separately and accepts PNG or JPEG images.

The generated package contains one English cover page followed by matched documents in the order specified by the imported requirements. Missing optional documents are skipped. A footer is added to every page in a reserved bottom margin.

## Run locally

Requirements:

- Node.js 24.x (LTS)
- pnpm 11.19.0 (the version declared by this project)

### macOS / Linux

If you already use nvm, install and select Node.js 24 with:

```bash
nvm install 24
nvm use 24
```

If `nvm` is not installed (for example, zsh reports `command not found: nvm`), you do not need to install it just for this project. Download the macOS Node.js 24 LTS installer from <https://nodejs.org/en/download>, install it, and open a new Terminal window.

Confirm the versions, then install the project dependencies:

```bash
node --version   # should print v24.x.x
npm install -g pnpm@11.19.0
pnpm --version   # should print 11.19.0
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://127.0.0.1:5173>.

To run checks and create a production build:

```bash
pnpm check
pnpm build
pnpm preview
```

The preview is available at <http://127.0.0.1:4173>.

### Windows PowerShell

The repository includes `project.cmd`, a helper for the original Windows development environment. If Node.js 24.x and pnpm 11.19.0 are already on your PATH, the standard pnpm commands above also work in PowerShell.

## Deploy to Vercel

This is a static Vite application. Import the GitHub repository into Vercel and use:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | `.` |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm run build` |
| Output directory | `dist` |
| Node.js version | 24.x |

The repository pins Node.js 24.x through `package.json`, `.nvmrc` and `.node-version`, and includes `vercel.json` with the build, output and security-header settings. Only the generated `dist/` directory is deployed. The source PDFs, sample pack, tests and development tools are not part of the deployed website.

## Project structure

```text
app/                 React + TypeScript browser application
  public/             Static public assets
  src/
    components/       Workflow UI
    domain/           Matching and status rules
    features/         JSON import, PDF intake and PDF generation
    i18n/             English and Bangla interface messages
docs/                Requirements, plan, decisions and verification notes
tests/               Unit and sample-pack integration tests
ViveCoding Problem/  Original problem statement and fictional sample pack
output/              Reserved for the final sample package
screenshots/         Project screenshots and verification evidence
dist/                Generated production build (not committed)
```

## Tests and continuous integration

Run `pnpm check` to execute strict TypeScript checks, the Vitest suite and the production build. The tests use the supplied fictional sample pack and derived in-memory cases. They do not modify the original source documents.

GitHub Actions runs the same `pnpm check` command on pushes to `main` and on pull requests. Check the repository's **Actions** tab for the result after pushing changes.

Before treating a release as complete, also run the app in a current Chrome browser, exercise the full sample workflow in both languages, generate and visually inspect the PDF, and verify the deployed website.

## Known limitations

- Work is not saved between browser sessions. Download the package before refreshing or closing the tab.
- Matching is manual; the user must inspect each document and choose its requirement.
- The optional index page, signature placement, automatic filename matching and AI assistance are not included.
- Registration number and live deployment URL must be filled in if required for a formal submission.
- Bengali text in the generated PDF is embedded with a Bengali font, but its final visual shaping should be checked in the generated PDF before relying on it for formal submission.

## AI use

AI tools used during development: OpenAI Codex and ChatGPT. The project prompt and implementation history is recorded in `docs/PROMPTS.md`. pnpm project settings are stored in `pnpm-workspace.yaml`, as required by pnpm 11; `.npmrc` is intentionally not used for project settings.

Most useful project-planning prompt: “Divide the project into parts at setup the environment with plugins and whatever we require so that we don't hallucinate or make anything wrong”.

The developer is responsible for reviewing and understanding the submitted code.

## License

This project is released under the MIT License. See [LICENSE](LICENSE).

## Sample data notice

The supplied sample pack states that all companies, people, numbers and documents in it are fictional. Use it only for testing the application. Do not upload real personal or confidential company documents to public repositories.
