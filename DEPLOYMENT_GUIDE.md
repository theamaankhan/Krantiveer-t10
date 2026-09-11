# Krantiveer Banda T10 — Website Deployment

## 1. Connect the backend
1. Open `index.html`.
2. Find `APPS_SCRIPT_URL` near the bottom.
3. Replace the placeholder with your deployed Google Apps Script Web App URL.
4. Do NOT put your Razorpay secret key in this website.

## 2. Test locally
Open `index.html` in a browser and test with dummy player/document data.

## 3. Deploy the website
Recommended simple flow:
- Upload this folder to a static hosting provider such as Vercel or Netlify.
- Set the production domain to `krantiveer-t10.com`.
- Also add `www.krantiveer-t10.com` if you want the www version.
- Use the DNS records shown by the hosting provider for your account; do not guess DNS values.

## 4. Razorpay
Use Razorpay Test Mode first. Keep:
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- RAZORPAY_WEBHOOK_SECRET

inside Google Apps Script Script Properties.

Before accepting live money, payment callback/webhook signature verification must be enabled and tested.

## 5. Important privacy note
Player ID documents are sensitive. Keep the Google Sheet/Drive private and never expose those URLs publicly.

## 6. Main files
- `index.html` — website
- `styles.css` — design
- `app.js` — registration submission
- `google-apps-script/Code.gs` — backend
- `logo.png` — tournament logo
- `team-logos/` — 12 team logos
