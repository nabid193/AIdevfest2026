# Release checklist

Use this checklist before publishing a portfolio release.

## 1. Local setup (macOS)

1. Install Node.js 24.x (LTS). The repository selects the Node.js 24 line in `.nvmrc`, `.node-version` and `package.json`. If `nvm` is not installed, use the macOS installer from https://nodejs.org/en/download.
2. From the repository root, enable Corepack and activate the pinned package manager:

   ```bash
   corepack enable
   corepack prepare pnpm@11.19.0 --activate
   ```

3. Install the locked dependencies:

   ```bash
   pnpm install --frozen-lockfile
   ```

## 2. Checks and production build

```bash
pnpm check
pnpm build
pnpm preview
```

Open `http://127.0.0.1:4173` after the preview server starts. Do not continue to deployment if type checks, tests or the build fail. After pushing, confirm the GitHub Actions **Project checks** workflow is green.

## 3. Browser acceptance

Use the official sample files under `ViveCoding Problem/problem-pack/sample-pack/`.

- Import `requirements.json`.
- Confirm the tender ID, title, entity, bidder and deadline.
- Add the PDF files. Confirm page counts and clear rejection of the PNG when it is added as a PDF.
- Confirm the two experience certificate files are marked as duplicate content.
- Match the current trade license, TIN, VAT, bank solvency, one experience certificate, technical proposal, financial proposal and scanned declaration.
- Leave the two optional requirements without files.
- Enter the expiry dates recorded in `docs/REQUIREMENTS.md`.
- Confirm every requirement has the expected status and generation is enabled only when there are no blocking statuses.
- Repeat the main workflow in Bangla.
- Export the CSV and open it in a spreadsheet application.
- Generate the PDF from the app and confirm the downloaded filename.
- Inspect all pages, source order, scanned declaration, cover details and footer placement.
- Test a narrow viewport, keyboard focus, malformed PDF, password-protected PDF and file removal/rematching.
- Inspect the browser Network panel to confirm the tender files are not uploaded.

## 4. Save release evidence

- Copy the app-generated sample package to `output/T-2026-0417_Package.pdf`.
- Save a screenshot of the completed document-status table under `screenshots/`.
- Update README with the real registration number if it is required and the real public URL after deployment.
- Update `docs/VERIFICATION.md` with the actual command output and browser results. Do not mark untested items as passed.

## 5. GitHub

Commit the source and evidence to `nabid193/AIdevfest2026`. Keep the supplied source PDFs, JSON, PNG and original filenames unchanged. Do not commit `node_modules/`, `.pnpm-store/`, `.vercel/` or `dist/`.

## 6. Vercel

Import the GitHub repository. The repository's `vercel.json` sets the Vite framework, install command, build command and `dist` output directory. The `package.json` engine selects Node.js 24.x on Vercel. Confirm Project Settings → Build & Development Settings → Node.js Version is also set to 24.x if it is overridden manually.

After deployment, open the public HTTPS URL in a signed-out Chrome session and repeat the main workflow. Verify that the deployed build corresponds to the GitHub commit you intend to publish.

The original contest deadline was in October 2026. This checklist is for a later portfolio release and does not establish contest eligibility.
