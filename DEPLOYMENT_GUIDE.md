# Krantiveer Banda T10 — Website Deployment

The site now redirects visitors to two real **Google Forms** (Player Registration and
Franchise Registration), and every response lands in a Google Sheet automatically. Follow the
steps in order.

## 1. Create the Google Forms (one-time)
1. Go to **https://script.new** (opens a blank Google Apps Script project). Sign in with the
   Google account you want to **own** the forms, sheet and uploaded files.
2. Delete the sample `function myFunction(){}` code.
3. Open `google-apps-script/CreateForms.gs` from this project, copy the entire file, and paste
   it into the Apps Script editor.
4. In the function dropdown at the top (next to "Debug"), select **createKrantiveerForms**,
   then click **Run ▶**.
5. The first run asks you to authorize the script — click **Review permissions**, choose your
   account, click **Advanced → Go to (project name)**, then **Allow**. This is expected for any
   script you write yourself; Google shows this warning for all unpublished/unverified scripts.
6. Once it finishes, open **Executions** (left sidebar, clock icon) or **View → Logs**
   (Ctrl+Enter) — you'll see something like:
   ```
   SPREADSHEET (all responses): https://docs.google.com/spreadsheets/d/XXXX/edit
   PLAYER FORM (share this):    https://docs.google.com/forms/d/e/XXXX/viewform
   PLAYER FORM (edit):          https://docs.google.com/forms/d/XXXX/edit
   FRANCHISE FORM (share this): https://docs.google.com/forms/d/e/YYYY/viewform
   FRANCHISE FORM (edit):       https://docs.google.com/forms/d/YYYY/edit
   ```
   The same links are also saved for you inside the new Spreadsheet, on a **"Form Links"**
   sheet — handy if you close the logs.
7. If you ever need the links again later without re-creating the forms, run
   **printSavedFormLinks** the same way.

## 2. Connect the forms to the website
1. Open `index.html`.
2. Find these two lines near the bottom:
   ```html
   const PLAYER_FORM_URL = "PLAYER_FORM_URL";
   const FRANCHISE_FORM_URL = "FRANCHISE_FORM_URL";
   ```
3. Replace the placeholder text with the two **"share this"** (`docs.google.com/forms/d/e/.../viewform`)
   links from step 1.6 above. (Optional: inside each form's editor you can click the paper-plane
   "Send" button → the link icon → "Shorten URL" to get a shorter `forms.gle/...` link instead —
   purely cosmetic, both work identically.)

## 3. Test locally
Open `index.html` in a browser, click **OPEN PLAYER REGISTRATION FORM** and **OPEN FRANCHISE
REGISTRATION FORM**, and submit a dummy entry into each. Check the linked Google Sheet — you
should see a new row appear within a few seconds in the matching tab
("Player Registrations" / "Franchise Registrations").

## 4. Deploy the website
Recommended simple flow:
- Upload this folder to a static hosting provider such as Vercel or Netlify.
- Set the production domain to `krantiveer-t10.com`.
- Also add `www.krantiveer-t10.com` if you want the www version.
- Use the DNS records shown by the hosting provider for your account; do not guess DNS values.

## 5. UPI / PhonePe payment
There is no payment gateway integration. The player scans the QR shown on the website, pays
₹500 manually via any UPI app, and enters the UTR / Transaction ID as a question inside the
Google Form. Verify UTRs manually from the "Player Registrations" sheet before confirming a
player's slot.

## 6. File uploads — important
Google Forms file-upload questions require the person filling the form to be **signed in with
a Google account** (any Gmail or Google Workspace account works — this is a Google requirement,
not something this site controls). Uploaded photos/ID documents are stored in a Drive folder
that Google Forms creates automatically inside the form owner's Drive, named after the form
(e.g. *"Krantiveer Banda T10 — Player Registration (Season 4) (File responses)"*).

## 7. Privacy note
Player and franchise ID documents are sensitive. Keep the Google Sheet and the linked Drive
upload folders **private** (default — don't share them publicly), and never expose their URLs
on the public website.

## 8. Main files
- `index.html` — website (registration section links to the two Google Forms)
- `styles.css` — design, including the registration "redirect" cards
- `app.js` — navigation, team grid, QR preview modal, and form-link wiring
- `google-apps-script/CreateForms.gs` — **run this once** to generate the Google Forms + Sheet
- `google-apps-script/Code.gs` — legacy custom backend, optional, not required for this setup
- `logo.png` — tournament logo
- `payment-qr.jpeg` — PhonePe / UPI QR code shown on the Player Registration card
- `team-logos/` — 12 team logos
