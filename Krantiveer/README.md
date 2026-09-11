
# Krantiveer Banda — registration + Razorpay-ready

This version adds the fields shown in your existing registration form:
- Player name, father's name, DOB
- ID proof type and number
- ID front/back uploads
- District, address, mobile, WhatsApp, email
- Player type
- Batting style
- Bowling arm and style
- Jersey number
- Preferred team
- T-shirt size and lower size
- Name on T-shirt
- T-shirt back number
- Auction photograph
- ₹500 registration fee
- Razorpay Payment Link creation
- Payment status fields in Google Sheet

## Google Sheet
Create a blank Google Sheet. Copy its ID from the URL and put it in:
`const SPREADSHEET_ID="YOUR_SHEET_ID";`
The script creates the `Players` tab and columns automatically.

## Razorpay
Use Razorpay Test Mode first. In Apps Script > Project Settings > Script properties add:
`RAZORPAY_KEY_ID`
`RAZORPAY_KEY_SECRET`
`RAZORPAY_WEBHOOK_SECRET`

The secret key is server-side only.

Deploy Apps Script as a Web app:
- Execute as: Me
- Who has access: Anyone

Then put the Web App URL into `index.html`:
`const APPS_SCRIPT_URL = "YOUR_WEB_APP_URL";`

## Important payment security
Razorpay's official Standard Checkout requires server-side order creation and payment-signature verification. Payment Links can also be created through the API and have a hosted payment page. Before accepting live money, configure and verify Razorpay webhooks/signatures on the server side and test the full flow in Test Mode.

## Sensitive data
ID numbers and ID files are sensitive. Keep the Google Sheet and Drive folder private to authorized organizers. Do not display them publicly.
