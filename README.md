# 🛡️ Guardian-Her - AI Personal Emergency & Safety Companion

## 📖 About

**Guardian-Her** is an AI-powered, privacy-first women's safety platform designed to provide intelligent emergency assistance and proactive safety support. The platform integrates one-tap SOS alerts, real-time location sharing, AI-powered safety guidance, safe route navigation, emergency contact management, multilingual accessibility, and offline-ready Progressive Web App (PWA) capabilities to help users stay safe anytime, anywhere.

---

## 🌐 Live Application Servers

When running locally in development mode:

* **Frontend Web Application (Vite + React)**: [`http://localhost:5173/`](http://localhost:5173/)
* **Backend API & Emergency Server (Node/Express)**: [`http://localhost:5000`](http://localhost:5000)

---

## ✨ Features

- 🚨 **One-Touch SOS Emergency Button**: Instantly alerts trusted contacts and logs location coordinates.
- 🗺️ **Safer Routes & Navigation Engine**: Real-time turn-by-turn guidance, crime heatmaps, and lighting warnings.
- 🔐 **User Authentication & Registration**:
  - Secure Registration & Sign-In with strict credential validation.
  - Permanent session persistence (registers once, never prompts again).
  - Password strength meter, confirm password validation, and Remember Me toggle.
  - 1-Click Quick Demo Sign In (`demo@guardian.her`).
- 🔑 **Password Reset System**: 6-digit verification code dispatch powered by Nodemailer.
- 🌐 **Multilingual Support**:
  - Full translations for **English**, **Hindi (हिंदी)**, **Kannada (ಕನ್ನಡ)**, and **Telugu (తెలుగు)**.
  - Real-time language switcher with native script labels.
- 🤖 **AI Safety Companion & Chatbot**: 24/7 intelligent supportive chatbot and safety guidance.
- ⏱️ **Check-In Watcher & Timer**: Automated scheduled safety check-ins with countdown alerts.
- 🎨 **Modern Aesthetics & Glassmorphism UI**: High-end vector graphics, soft dusk twilight gradients, and responsive layouts.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/sahana-ns14/Guardian-Her.git
cd Guardian-Her
```

### 2. Run the Backend API Server
```bash
cd server
npm install
npm run dev
```
*Backend server runs on port 5000 (`http://localhost:5000`)*

### 3. Run the Frontend Application
```bash
# Open a new terminal in root directory:
npm install
npm run dev
```
*Frontend app runs on port 5173 (`http://localhost:5173/`)*

---

## ⚙️ Environment Configuration (`server/.env`)

Create a `.env` file in the `server/` folder:

```env
PORT=3000
PUBLIC_URL=http://localhost:3000

# Optional Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Optional Gmail SMTP Configuration (for Direct Gmail OTP Dispatches)
GMAIL_USER=yourgmail@gmail.com
GMAIL_APP_PASS=your_16_digit_app_password
```

---

*Dedicated to Women's Safety Throughout The World!*
