# Krantiveer Cricket League — Banda T10 Season 4 (2026)

Official tournament website with separate **Player Registration** and **Franchise Registration**
forms. Both are now real **Google Forms**, and every submission is stored automatically in a
**Google Sheet** — no custom backend required.

## How it works
1. The website (`index.html`) has an "OFFICIAL REGISTRATION PORTAL" section with a card for
   Players and a card for Franchises.
2. Each card has an **"OPEN … REGISTRATION FORM ↗"** button that opens the matching official
   Google Form in a new tab.
3. The visitor fills the Google Form (including uploading their photo/ID documents — this
   requires signing in with a Google account, which is a Google Forms requirement for file
   uploads).
4. Google Forms writes every response as a new row into the linked Google Sheet automatically.
   There is nothing to sync — it's instant and native.

## Forms
- **Player registration**: personal/ID details, cricket profile, T-shirt details, document
  uploads (photo + ID front/back) and the ₹500 UPI/PhonePe payment UTR.
- **Franchise registration**: franchise/team name, owner/representative details, address, ID
  documents (front/back). No payment collected for franchises.
- Player bowling style options are only **Medium Fast** and **Spin**.
- Neither form asks for preferred team, captain/team owner name, or registration type — team
  allocation is handled separately by the tournament.

## Creating the Google Forms
Run `google-apps-script/CreateForms.gs` **once** from [script.new](https://script.new) — it
builds both forms field-for-field (matching the site copy above), creates a single Google
Sheet with a "Player Registrations" tab and a "Franchise Registrations" tab, and links each
form's responses to the matching tab. Full step-by-step instructions are inside that file and
in `DEPLOYMENT_GUIDE.md`.

After running it, paste the two generated form links into `index.html`
(`PLAYER_FORM_URL` and `FRANCHISE_FORM_URL`) so the website's buttons point at your real forms.

## Payment flow
Player registration still uses the supplied PhonePe QR image on the website. The player scans
it, pays ₹500 manually, then opens the Google Form and enters the UTR / Transaction ID as one
of the form questions. Verification of the UTR against the actual payment is done manually by
the tournament team from the Google Sheet — there is no payment gateway integration.

Franchise registration does not collect a team name, logo, or payment.

## Legacy backend (optional)
`google-apps-script/Code.gs` is the **previous** custom Apps Script Web App (used by the old
embedded HTML forms + `app.js` submission code). It is **no longer required** now that the site
links straight to native Google Forms, but it's kept in the repo for reference in case you ever
want a hybrid setup (e.g. embedded forms with custom validation) instead of the Google Forms
redirect flow.

## Hero imagery
The hero uses free-to-use Unsplash/Pexels photography loaded remotely for the stadium/player
atmosphere. An internet connection is required for those two hero photos.
