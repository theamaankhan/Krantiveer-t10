# Krantiveer Cricket League — Banda T10 Season 4

Professional registration website for Krantiveer Cricket League — Banda T10, Season 4 (2026).

## Registration backend

The website has one public registration portal but sends data into **two separate Google Spreadsheet files**:

- **Krantiveer Banda T10 — Player Registrations 2026** — player details, documents, ₹500 payment status and UTR
- **Krantiveer Banda T10 — Franchise Registrations 2026** — franchise / owner details and documents

The Apps Script also stores player and franchise documents in separate private Google Drive folders.

## Why the submission uses a hidden form

Google Apps Script Web Apps commonly redirect their POST response to a Google-hosted origin. A normal browser `fetch()` call from a Vercel/custom-domain website can therefore fail with **`Failed to fetch` because of browser CORS restrictions**, even though the Apps Script URL itself works.

This version avoids that problem without requiring a Vercel proxy: the website posts the registration to Apps Script through a hidden HTML form/iframe, and the Apps Script sends the result back with `postMessage`.

## Payment

Player registration is **₹500** using the PhonePe / UPI QR shown on the form. The player enters the UTR / Transaction ID. There is no Razorpay flow.

## Main files

- `index.html` — website and registration forms
- `styles.css` — design, responsive layout and dynamic effects
- `app.js` — frontend behavior and CORS-safe Apps Script submission
- `google-apps-script/Code.gs` — Google Sheets + Drive backend
- `payment-qr.jpeg` — PhonePe / UPI QR
- `team-logos/` — 12 team logos

See `DEPLOYMENT_GUIDE.md` for the exact deployment sequence.
