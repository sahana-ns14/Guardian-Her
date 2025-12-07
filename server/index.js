import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (siren.mp3)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// SOS logging endpoint
app.post('/sos', (req, res) => {
  const { contacts, message, locationURL } = req.body;

  console.log("--- SOS ALERT LOGGED (Native SMS Triggered) ---");
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Location: ${locationURL}`);
  console.log(`Contacts to notify (Client-side): ${contacts?.length || 0}`);

  if (contacts && Array.isArray(contacts)) {
    contacts.forEach(c => console.log(`- ${c.name}: ${c.phone}`));
  }

  res.json({ success: true, message: "SOS Logged on Server" });
});

// In-memory mock user database
const users = [
  {
    id: 'user_demo_1',
    name: 'Aditi Sharma',
    email: 'demo@guardian.her',
    phone: '+919876543210',
    password: 'password123',
    medicalNotes: 'No known allergies. Blood type O+',
    contacts: [
      { id: 'c1', name: 'Mom', phone: '+919800011122' },
      { id: 'c2', name: 'Sister', phone: '+919800033344' }
    ]
  }
];

// Authentication Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, phone, password } = req.body;
  const loginIdentifier = (email || phone || '').toLowerCase().trim();

  if (!loginIdentifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email or phone number and password.'
    });
  }

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === loginIdentifier || u.phone === loginIdentifier
  );

  // Strict Check: User MUST be registered first
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'No account found with this email. Please register / create an account first.'
    });
  }

  // Strict Check: Password must match
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password. Please check your password and try again.'
    });
  }

  const token = `gh_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`--- USER LOGGED IN SUCCESSFULLY: ${user.email} ---`);

  res.json({
    success: true,
    token,
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      medicalNotes: user.medicalNotes || '',
      contacts: user.contacts || []
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required.'
    });
  }

  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists.'
    });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email: email.toLowerCase().trim(),
    phone: phone || '',
    password,
    medicalNotes: '',
    contacts: []
  };

  users.push(newUser);

  const token = `gh_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`--- NEW USER REGISTERED: ${newUser.email} ---`);

  res.json({
    success: true,
    token,
    user: {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      medicalNotes: '',
      contacts: []
    }
  });
});

// In-memory reset tokens store (email -> { code, expiresAt })
const resetTokens = {};

// Nodemailer Email Transporter Helper
const getEmailTransporter = async () => {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
      }
    });
  }

  // Fallback to auto-created test account (Ethereal) if Gmail environment variables aren't provided
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const cleanEmail = (email || '').toLowerCase().trim();

  if (!cleanEmail) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.'
    });
  }

  const user = users.find(
    (u) => u.email.toLowerCase() === cleanEmail || u.phone === cleanEmail
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No registered account found with this email address.'
    });
  }

  // Generate a 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  resetTokens[user.email.toLowerCase()] = {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
  };

  console.log(`--- PASSWORD RESET REQUEST FOR ${user.email} | OTP CODE: ${code} ---`);

  let previewUrl = null;
  try {
    const transporter = await getEmailTransporter();
    const mailOptions = {
      from: '"Guardian-Her Emergency App" <no-reply@guardian.her>',
      to: user.email,
      subject: 'Guardian-Her: Password Reset Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #fcf8f6; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #fecdd3;">
          <h2 style="color: #e11d48; margin-top: 0;">🛡️ Guardian-Her Password Reset</h2>
          <p style="color: #374151; font-size: 15px;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">You requested a password reset for your Guardian-Her account. Use the verification code below to set your new password:</p>
          <div style="background: #ffe4e6; border: 2px dashed #f43f5e; padding: 16px; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #be123c; text-align: center; margin: 24px 0;">
            ${code}
          </div>
          <p style="color: #6b7280; font-size: 13px;">This code is valid for 15 minutes. If you did not request this, you can safely ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`--- VERIFICATION EMAIL DISPATCHED TO: ${user.email} (ID: ${info.messageId}) ---`);

    const testUrl = nodemailer.getTestMessageUrl(info);
    if (testUrl) {
      previewUrl = testUrl;
      console.log(`--- LIVE TEST EMAIL INBOX PREVIEW: ${previewUrl} ---`);
    }
  } catch (emailErr) {
    console.error("Nodemailer Email Dispatch Error:", emailErr);
  }

  res.json({
    success: true,
    message: `Verification code dispatched to ${user.email}.`,
    otpCode: code,
    previewUrl
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;
  const cleanEmail = (email || '').toLowerCase().trim();

  if (!cleanEmail || !code || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Email, verification code, and new password are required.'
    });
  }

  const tokenData = resetTokens[cleanEmail];

  if (!tokenData || tokenData.code !== code.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification code. Please request a new one.'
    });
  }

  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User account not found.'
    });
  }

  user.password = newPassword;
  delete resetTokens[cleanEmail];

  console.log(`--- PASSWORD RESET SUCCESSFUL FOR ${user.email} ---`);

  res.json({
    success: true,
    message: 'Your password has been successfully reset! You can now sign in.'
  });
});

// Status logging endpoint
app.post('/status', (req, res) => {
  const { phone, status, locationURL } = req.body;
  console.log(`--- STATUS UPDATE (${status}) ---`);
  console.log(`To: ${phone}`);
  console.log(`Location: ${locationURL}`);
  res.json({ success: true, message: "Status Logged" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Guardian-Her Backend running on port ${PORT}`);
});
