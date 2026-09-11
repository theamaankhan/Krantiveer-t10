# Krantiveer Banda T10 — Fixed Google Sheets Deployment Guide

## What this version fixes

The earlier website used browser `fetch()` directly against the Google Apps Script `/exec` URL. Google Apps Script Web Apps can redirect their response to a Google-hosted origin, so the browser can report:

> Could not submit: Failed to fetch

This does **not necessarily mean the Apps Script is offline**. It is commonly a browser CORS/redirect problem.

This version changes the transport to:

**Website → hidden HTML form → Apps Script Web App → Google Sheets / Drive → postMessage → website**

This keeps the two-sheet setup and removes the browser `fetch()` CORS failure.

## 1. Replace the Apps Script code

1. Open Google Drive using the Google account that should own the registration sheets and uploaded documents.
2. Open your Apps Script project.
3. Replace the complete Apps Script code with:

   `google-apps-script/Code.gs`

4. Save the project.

## 2. Run `setupSheets` once

In Apps Script:

1. Select the function **`setupSheets`**.
2. Click **Run**.
3. Approve the requested Google Sheets / Drive permissions.
4. Open the execution log. It will print:
   - `PLAYER SHEET: ...`
   - `FRANCHISE SHEET: ...`

You should now have two separate spreadsheet files:

- `Krantiveer Banda T10 — Player Registrations 2026`
- `Krantiveer Banda T10 — Franchise Registrations 2026`

It also creates two separate Drive folders:

- `Krantiveer Banda T10 — Player Documents`
- `Krantiveer Banda T10 — Franchise Documents`

## 3. Deploy the corrected Apps Script Web App

If this Apps Script project already has a Web App deployment:

1. Go to **Deploy → Manage deployments**.
2. Edit the existing Web App deployment.
3. Deploy a **new version** of the same deployment.
4. Keep the same `/exec` URL.

Recommended settings:

- **Execute as:** Me
- **Who has access:** Anyone

If this is a brand-new deployment, copy its `/exec` URL.

## 4. Verify the Apps Script endpoint

Open the `/exec` URL in your browser.

You should see JSON similar to:

`{"ok":true,"message":"Krantiveer Banda T10 registration backend is live."}`

That confirms the Web App is deployed. The browser submission itself no longer uses `fetch()`, so the CORS redirect problem is avoided.

## 5. Update the website endpoint

In `index.html`, find:

```js
const APPS_SCRIPT_URL = "...";
```

Put your current Apps Script Web App `/exec` URL there.

The current package already contains the previous `/exec` URL. Replace it only when your deployment URL is different.

## 6. Upload this complete website package to Vercel

Upload **all files and folders** from this package, including:

- `index.html`
- `styles.css`
- `app.js`
- `logo.png`
- `payment-qr.jpeg`
- `team-logos/`
- `google-apps-script/`
- `robots.txt`
- `sitemap.xml`

After deployment, use:

`https://krantiveer-t10.com/`

## 7. Test Player Registration

Submit one test player registration.

The website should show:

**Registration received**

with a registration ID such as:

`KVB-PLY-...`

Then check the separate Player spreadsheet. A new row should contain:

- timestamp
- registration ID
- player details
- cricket profile
- T-shirt details
- document URLs
- ₹500 registration fee
- UTR / Transaction ID
- payment status

## 8. Test Franchise Registration

Submit one test franchise registration.

The website should show:

**Franchise enquiry received**

with a registration ID such as:

`KVB-FRN-...`

Then check the separate Franchise spreadsheet.

## 9. Important when changing Apps Script code later

Do not create a random new Apps Script project every time.

For normal code updates:

**Apps Script → Deploy → Manage deployments → Edit → new version → Deploy**

Keep the same Web App `/exec` URL so the live website continues using the same endpoint.

## Final data flow

### Player

Website player form
→ Apps Script Web App
→ **Player Registrations 2026 spreadsheet**
→ Player Documents folder

### Franchise

Website franchise form
→ Apps Script Web App
→ **Franchise Registrations 2026 spreadsheet**
→ Franchise Documents folder
