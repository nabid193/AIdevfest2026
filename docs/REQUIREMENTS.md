# Source-backed requirements

## Authoritative sources

| Key | Local source | Relevant sections |
| --- | --- | --- |
| P | `ViveCoding Problem/AIDevFest-ViveCoding ProblemStatement.pdf` (5 pages) | 4: main tasks; 5: statuses; 6: output; 7: bonus; 8: limits; 9: deliverables |
| V | `AI DevFest Vibe Coding Rulebook.pdf` (9 pages) | 5: technical; 8: commits; 9: submission; 10: deployment; 11: license/data |
| G | `AI_DEV_FEST_2026_General_Rules.pdf` (7 pages) | 4-5: integrity/AI; 6-8: deadlines/judging; 11.2: specific rules take precedence |
| S | `ViveCoding Problem/problem-pack/sample-pack/requirements.json` and `README.txt` | Actual sample contract and fictional-data notice |

The old Smart Escape PDF/root README_START_HERE.txt are not sources for this application.

## Mandatory traceability matrix

| ID | Source | Required behavior | Verification |
| --- | --- | --- | --- |
| M01 | P4.1 | Load JSON; show tender_id, title, procuring_entity, bidder, submission_deadline and requirements by order | Official JSON; generic IDs and variable lists supported |
| M02 | P4.2/P8 | Multiple PDF upload, name/page count, clear non-PDF rejection, removal; up to 30 files/50 MB total | Ten official PDFs, PNG rejection; limit boundary checks |
| M03 | P4.3 | Each file to at most one requirement, each requirement at most one file; change/undo matches | Reassign, replace, unmatch and remove without stale state |
| M04 | P4.4 | Expiry input for matched has_expiry=true requirements | Fields appear only where relevant; stale expiry never silently transfers to replacement file |
| M05 | P4.5/P5 | Exactly one status per requirement, recomputed after each change | Status table below, including optional supplied documents |
| M06 | P4.6 | Exact-content duplicates marked, even with different names; cannot satisfy different requirements | SHA-256 of supplied experience certificate pair is identical |
| M07 | P4.7 | Disable Generate while blocking statuses exist; explain reasons | All three blocking states and recovery |
| M08 | P4.8 | Download named <tender_id>_Package.pdf | Actual browser download filename |
| M09 | P4.9/V5.6 | Whole principal UI in Bangla/English; requirement title from title_bn/title_en | Full flow in both modes, including errors and instructions |
| M10 | P6.1 | First page English cover: tender ID/title/entity/bidder/deadline/generated date/included documents in order | Extract and visually inspect cover |
| M11 | P6.2 | All pages of each matched file in original order, documents sorted by order; skip absent optional files | Selected eight files yield 15 source pages |
| M12 | P6.3-6.4 | Footer on every page including cover: <tender_id> \| Page X of Y; readable, no content overlap | 16 pages for basic sample; inspect bottom margins and rotated/cropped pages when relevant |
| M13 | P8/V5.1 | All document processing in browser; no backend or remote document storage | Browser network inspection and static-only build |
| M14 | P3/P10 | Work with unseen packs of the same format; usable by office staff | No sample-specific production branches or hard-coded titles/IDs |
| M15 | P9/V9-10 | Required PDF in output/, status screenshots, README, MIT, public GitHub, final SHA, matching public HTTPS deployment | Delivery checklist and actual signed-out live check |

## Exact status precedence

| Condition | Status | Blocks generation? |
| --- | --- | --- |
| No match, mandatory=true | Missing | Yes |
| No match, mandatory=false | Not provided | No |
| Matched, has_expiry=true, no date | Expiry date needed | Yes |
| Matched, has_expiry=true, expiry before deadline | Expired | Yes |
| Matched, no expiry needed OR expiry on/after deadline | OK | No |

Validate entered dates before domain evaluation; do not invent an additional requirement status. An optional supplied document with invalid/missing expiry still blocks. Duplicate is an uploaded-file marker, not a sixth requirement status. Compare date-only values against the imported deadline, not today's date.

## Required sample outcome

Tender T-2026-0417; deadline 2026-10-20; bidder Meghna Tech Solutions Ltd.; title Supply of IT Equipment; procuring entity Directorate of Sample Services.

| Order / ID | Document | Correct file | Pages | Expiry |
| --- | --- | --- | --- | --- |
| 1 / R01 | Trade License | trade_license_2026.pdf | 1 | 2027-06-30 |
| 2 / R02 | TIN Certificate | 03_tin_certificate.pdf | 1 | Not required |
| 3 / R03 | VAT Registration Certificate | 04_vat_certificate.pdf | 1 | Not required |
| 4 / R04 | Bank Solvency Certificate | bank_solvency.pdf | 1 | 2026-12-31 |
| 5 / R05 | Experience Certificate | experience_cert.pdf (or identical copy, once) | 2 | Not required |
| 6 / R06 | Audited Financial Statement | Absent; optional | 0 | Not required |
| 7 / R07 | Manufacturer's Authorization | Absent; optional | 0 | Would be required if supplied |
| 8 / R08 | Technical Proposal | 02_technical_proposal.pdf | 6 | Not required |
| 9 / R09 | Financial Proposal | 01_financial_proposal.pdf | 2 | Not required |
| 10 / R10 | Signed Declaration | scan_0042.pdf | 1 | Not required |

Basic output: one cover plus 15 document pages = 16 pages. No bonus index included. Old trade_license_2025.pdf expires 2025-06-30 and must not be selected for a valid package. company_logo.png is correctly rejected by PDF intake and can be selected separately in the optional cover-logo picker. scan_0042.pdf is a real image-only declaration, not a corrupt/empty PDF. No OCR requirement. Filenames do not determine order.

## Optional work (P7)

Index with document starting pages; PNG seal/signature on chosen pages; company logo on the cover; Excel/CSV checklist; saved/reopened work; Bangla PDF text; filename-based suggestions; clear damaged/encrypted PDF errors; optional user-key AI. Main tasks take priority. ZIP import and automatic expiry extraction are not mandatory. The cover logo is selected separately from PDF intake, accepts locally validated PNG/JPEG, and is never preloaded from sample data.

## Contest obligations

30-minute setup, 90-minute build/deploy. README/LICENSE only before T+0; no prewritten project code. At least three contest-time commits, at least every 30 minutes; summary and actual prompt or Manual edit in each. No history rewriting. Final pushed commit and matching deployment by T+90. Specific rulebook's T+90–95 window is form-only and penalized. Follow organizer changes; user reports approval for AIdevfest2026 repository name. MIT license; only supplied fictional test data; comply with third-party licenses; no secrets. Latest Chrome and public HTTPS with no sign-in/install. Keep site available through judging/results.
