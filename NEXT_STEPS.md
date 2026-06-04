# MCRB Website — Next Steps & Integration Roadmap

> **Last updated:** 27 May 2026  
> **Current status:** Static front-end complete and validated. All assets consolidated.

---

## Table of Contents

1. [Payment Gateway Integrations](#1-payment-gateway-integrations)
   - [M-Pesa (Safaricom Daraja API)](#11-m-pesa--safaricom-daraja-api)
   - [Airtel Money](#12-airtel-money)
   - [Card Payments (Visa / Mastercard)](#13-card-payments-visa--mastercard)
   - [Other Payment Methods](#14-other-payment-methods)
2. [Chatbot Integration](#2-chatbot-integration)
3. [Backend & Infrastructure](#3-backend--infrastructure)
4. [Security & Compliance](#4-security--compliance)
5. [Future Enhancements](#5-future-enhancements)
6. [Priority Matrix](#6-priority-matrix)

---

## 1. Payment Gateway Integrations

### 1.1 M-Pesa — Safaricom Daraja API

M-Pesa is the primary payment channel for MCRB (Paybill **303030**).

#### What We Need

| Item | Detail |
|------|--------|
| **API** | [Safaricom Daraja 2.0](https://developer.safaricom.co.ke/) |
| **Endpoints** | STK Push (Lipa Na M-Pesa Online), C2B Register URL, Transaction Status, Account Balance |
| **Credentials** | Consumer Key, Consumer Secret, Passkey, Shortcode (303030) |
| **Environment** | Sandbox → Production (requires Business go-live approval from Safaricom) |

#### Integration Steps

1. **Register on Daraja Portal** — Create a developer account at `developer.safaricom.co.ke`.
2. **Create an App** — Get sandbox Consumer Key & Secret.
3. **Build Backend Endpoint** — Create a Node.js/Express (or Python/Flask) server to:
   - Generate OAuth access tokens.
   - Initiate STK Push requests when user clicks "Pay via M-Pesa" on MeruPay Portal.
   - Listen on a **Callback URL** for payment confirmation.
   - Store transaction records in a database.
4. **C2B Registration** — Register Confirmation and Validation URLs with Safaricom so that any direct Paybill payments (e.g., via phone) are captured.
5. **Transaction Status Query** — Poll or query for payment status if callback is delayed.
6. **Go Live** — Apply to Safaricom for production credentials once sandbox testing is complete.

#### Sample STK Push Flow (Current → Target)

```
Current:  User clicks "Pay" → Simulated STK popup (mock)
Target:   User clicks "Pay" → Backend calls Daraja STK Push API →
          User gets real STK prompt on phone → PIN entry →
          Safaricom sends callback to our server → Receipt displayed
```

#### Key Files to Modify

- `app.js` — Replace `simulateStkPush()` with a real `fetch()` call to backend.
- `index.html` — No major changes needed (portal UI is ready).
- **New:** `server/mpesa.js` — Backend route for STK Push & callbacks.

---

### 1.2 Airtel Money

#### What We Need

| Item | Detail |
|------|--------|
| **API** | [Airtel Money Africa API](https://developers.airtel.africa/) |
| **Endpoints** | Collection API (USSD Push), Transaction Enquiry, Refund |
| **Credentials** | Client ID, Client Secret from Airtel developer portal |
| **Country** | Kenya (KE) |

#### Integration Steps

1. **Register on Airtel Developer Portal** — `developers.airtel.africa`
2. **Get API credentials** — Apply for Collection API access for Kenya.
3. **Build Backend Endpoint** — Similar to M-Pesa:
   - Generate OAuth token.
   - Initiate USSD push payment request.
   - Listen on callback URL for payment confirmation.
4. **Add UI Toggle** — On the MeruPay Portal, add a payment method selector:
   - ○ M-Pesa  ○ Airtel Money  ○ Card
5. **Detect Phone Prefix** — Auto-detect network from phone number:
   - `07XX` → Safaricom (M-Pesa)
   - `0733/0755/0780` → Airtel Money
6. **Go Live** — Submit for production review.

#### Key Files to Modify

- `app.js` — Add `payViaAirtel()` handler alongside `payViaMpesa()`.
- `index.html` — Add Airtel radio option in portal payment form.
- **New:** `server/airtel.js` — Backend route for Airtel Collection API.

---

### 1.3 Card Payments (Visa / Mastercard)

#### Payment Gateway Options for Kenya

| Provider | Pros | Cons |
|----------|------|------|
| **Flutterwave** | Easy JS SDK, supports KES, good docs | Transaction fees ~2.5% |
| **Paystack** | Clean API, popular in East Africa | Now owned by Stripe |
| **iPay Africa** | Kenyan-based, government-friendly | Smaller developer community |
| **PesaPal** | Well-established in Kenya, supports multiple methods | Slightly complex integration |
| **JamboPay** | MCRB has prior relationship (was previous payment partner) | Proprietary integration |

#### Recommended: Flutterwave or PesaPal

Both support:
- Visa / Mastercard / Amex
- M-Pesa and Airtel Money (so you can consolidate)
- KES currency
- Hosted checkout and inline payment modals

#### Integration Steps (Flutterwave Example)

1. **Sign up** at `dashboard.flutterwave.com`.
2. **Get API Keys** — Public Key (frontend), Secret Key (backend).
3. **Inline Checkout** — Add Flutterwave's JS SDK to `index.html`:
   ```html
   <script src="https://checkout.flutterwave.com/v3.js"></script>
   ```
4. **Initiate Payment** — On "Pay by Card" button click:
   ```javascript
   FlutterwaveCheckout({
     public_key: "FLWPUBK-xxxxx",
     tx_ref: "MCRB-" + Date.now(),
     amount: totalPayable,
     currency: "KES",
     customer: { email: "user@example.com", phone_number: "0712345678" },
     callback: function(data) { /* verify on backend */ },
     onclose: function() { /* user closed modal */ }
   });
   ```
5. **Backend Verification** — Verify the transaction on your server using the Secret Key before issuing a receipt.
6. **Webhook** — Set up webhook URL for asynchronous payment notifications.

#### Key Files to Modify

- `index.html` — Add Flutterwave JS SDK script tag.
- `app.js` — Add card payment flow with `FlutterwaveCheckout()`.
- **New:** `server/card.js` — Backend verification endpoint.

---

### 1.4 Other Payment Methods

| Method | Approach | Priority |
|--------|----------|----------|
| **USSD (*377#)** | Server-side USSD gateway integration (Africa's Talking or Safaricom USSD API) | High — already advertised on site |
| **Bank Transfer / EFT** | Display bank details + use reconciliation API | Medium |
| **KCB / Equity Mobile Banking** | Partner bank APIs | Low |
| **QR Code Payment** | Generate M-Pesa QR via Daraja "Dynamic QR" endpoint | Medium — good for market stalls |

---

## 2. Chatbot Integration

### Options

| Platform | Type | Pros | Pricing |
|----------|------|------|---------|
| **Tawk.to** | Live chat + bot | Free tier, easy embed, agent dashboard | Free / Paid tiers |
| **Crisp** | Live chat + bot builder | Modern UI, knowledge base | Free / $25/mo |
| **Dialogflow (Google)** | AI chatbot | NLP-powered, multilingual (Kimeru/Swahili) | Free tier available |
| **Tidio** | Chat + AI bot | Visual flow builder, easy setup | Free / $29/mo |
| **Custom (OpenAI API)** | AI assistant | Full control, MCRB-specific knowledge base | API costs |

### Recommended Approach: Tawk.to (Phase 1) + Custom AI Bot (Phase 2)

#### Phase 1 — Live Chat Widget (Quick Win)

1. **Sign up** at `tawk.to`.
2. **Create a property** for MCRB.
3. **Embed the widget** — Add one script tag before `</body>` in `index.html`:
   ```html
   <!--Start of Tawk.to Script-->
   <script type="text/javascript">
     var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
     (function(){
       var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
       s1.async=true;
       s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
       s1.charset='UTF-8';
       s1.setAttribute('crossorigin','*');
       s0.parentNode.insertBefore(s1,s0);
     })();
   </script>
   <!--End of Tawk.to Script-->
   ```
4. **Set up canned responses** — Pre-load answers for common queries (same as our FAQ section):
   - Land rates deadlines
   - SBP fee calculation
   - Payment methods
   - Office location & hours
5. **Assign agents** — MCRB customer service staff log into Tawk.to dashboard.

#### Phase 2 — AI-Powered Chatbot

1. **Train on MCRB data** — Feed the Meru County Revenue Board Act, Finance Act schedules, FAQ content, and service descriptions.
2. **Build conversational flows:**
   - "How much is my SBP?" → Trigger fee calculator
   - "Pay my land rates" → Redirect to MeruPay Portal
   - "Where is the office?" → Show map & address
   - "Download the Revenue Board Act" → Link to PDF
3. **Multilingual** — Support English, Swahili, and optionally Kimeru.
4. **Escalation** — If the bot can't answer, hand off to a live agent.

#### Key Files to Modify

- `index.html` — Add chat widget script.
- **New:** `chatbot/config.json` — Bot flow configuration.
- **New:** `chatbot/training-data.json` — FAQ pairs for AI training.

---

## 3. Backend & Infrastructure

Before any real payment integration works, we need a backend server.

### Recommended Stack

| Component | Technology | Why |
|-----------|------------|-----|
| **Runtime** | Node.js 20 LTS | Large ecosystem, async-friendly |
| **Framework** | Express.js | Lightweight, flexible |
| **Database** | PostgreSQL (or MongoDB) | Reliable, good for transactions |
| **ORM** | Prisma (or Mongoose) | Type-safe queries |
| **Hosting** | Railway / Render / DigitalOcean | Easy deployment, supports KE region |
| **SSL** | Let's Encrypt (via Caddy or Nginx) | Free HTTPS — required for payment APIs |

### Backend Setup Checklist

- [ ] Initialize Node.js project (`npm init`)
- [ ] Set up Express server with CORS, helmet, rate limiting
- [ ] Create database schema (users, transactions, bills, receipts)
- [ ] Build M-Pesa route (`/api/mpesa/stkpush`, `/api/mpesa/callback`)
- [ ] Build Airtel Money route (`/api/airtel/pay`, `/api/airtel/callback`)
- [ ] Build card payment verification route (`/api/card/verify`)
- [ ] Add authentication (JWT or session-based) for admin portal
- [ ] Set up environment variables (`.env`) for all API keys
- [ ] Deploy to staging environment
- [ ] SSL certificate for callback URLs (Safaricom/Airtel require HTTPS)

---

## 4. Security & Compliance

| Requirement | Action |
|-------------|--------|
| **HTTPS** | All payment pages and APIs must use TLS 1.2+ |
| **PCI DSS** | If handling card data directly — use hosted checkout (Flutterwave/PesaPal) to avoid PCI scope |
| **Data Protection Act (Kenya)** | Comply with Kenya's Data Protection Act 2019 — privacy policy, data processing consent |
| **Transaction Logging** | Log all payment attempts, successes, and failures with timestamps |
| **Callback Validation** | Verify that callbacks genuinely come from Safaricom/Airtel (IP whitelisting, signature verification) |
| **Rate Limiting** | Prevent abuse of payment endpoints |
| **Input Validation** | Sanitize all user inputs (phone numbers, amounts, reference codes) |

---

## 5. Future Enhancements

| Feature | Description | Priority |
|---------|-------------|----------|
| **Admin Dashboard** | Internal portal for MCRB staff to view collections, generate reports, manage bills | High |
| **SMS Notifications** | Send payment reminders and receipts via Africa's Talking SMS API | High |
| **Email Receipts** | Auto-send PDF receipts via SendGrid / Mailgun | Medium |
| **PWA (Progressive Web App)** | Add service worker + manifest for offline access and "Add to Home Screen" | Medium |
| **Multi-language Support** | Swahili and Kimeru translations | Medium |
| **Accessibility (WCAG)** | Ensure site meets WCAG 2.1 AA standards | Medium |
| **Analytics** | Google Analytics 4 or Plausible for traffic and conversion tracking | Low |
| **Board Portal** | Secure login area for board members to review reports | Low |

---

## 6. Priority Matrix

### Phase 1 — Immediate (Weeks 1–4)
- [x] Clean up project structure and consolidate assets
- [ ] Set up Node.js backend with Express
- [ ] Integrate M-Pesa STK Push (Daraja sandbox)
- [ ] Embed Tawk.to live chat widget
- [ ] Deploy to staging server with HTTPS

### Phase 2 — Short Term (Weeks 5–8)
- [ ] M-Pesa production go-live
- [ ] Add Airtel Money payment option
- [ ] Integrate card payments (Flutterwave or PesaPal)
- [ ] Build admin dashboard (basic transaction viewer)
- [ ] Add SMS notification system

### Phase 3 — Medium Term (Months 3–4)
- [ ] AI chatbot with MCRB knowledge base
- [ ] PWA conversion
- [ ] Email receipt system
- [ ] Multi-language support (Swahili)
- [ ] USSD gateway (*377#) integration

### Phase 4 — Long Term (Months 5+)
- [ ] QR code payments at physical locations
- [ ] Full admin portal with reports and analytics
- [ ] Bank API integrations
- [ ] Mobile app (React Native or Flutter)
- [ ] Board member secure portal

---

## Quick Reference — API Documentation Links

| Service | Documentation URL |
|---------|-------------------|
| Safaricom Daraja (M-Pesa) | https://developer.safaricom.co.ke/APIs |
| Airtel Money Africa | https://developers.airtel.africa/ |
| Flutterwave | https://developer.flutterwave.com/docs |
| PesaPal | https://developer.pesapal.com/ |
| Paystack | https://paystack.com/docs/ |
| Africa's Talking (SMS/USSD) | https://africastalking.com/docs |
| Tawk.to (Chat) | https://developer.tawk.to/ |
| Dialogflow (Chatbot) | https://cloud.google.com/dialogflow/docs |

---

> **Note:** All payment integrations require a registered backend server with HTTPS. The current static site will need to be paired with a server-side application before any real transactions can be processed.
