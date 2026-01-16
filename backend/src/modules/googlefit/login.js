// import express from "express";
// import { google } from "googleapis";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const REDIRECT_URI =
//   process.env.REDIRECT_URI || "http://localhost:5000/auth/google/callback";
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// // Inisialisasi OAuth2 Client
// const oauth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );

// // SCOPES — data yang kamu minta dari Google Fit dan akun
// const SCOPES = [
//   "https://www.googleapis.com/auth/fitness.activity.read",
//   "https://www.googleapis.com/auth/fitness.body.read",
//   "https://www.googleapis.com/auth/userinfo.profile",
//   "https://www.googleapis.com/auth/userinfo.email",
// ];

// // --- [1] ROUTE LOGIN: Redirect ke Google Consent Screen ---
// router.get("/google", (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent",
//     scope: SCOPES,
//   });
//   res.redirect(url);
// });

// // --- [2] ROUTE CALLBACK: Google redirect ke sini setelah login ---
// router.get("/google/callback", async (req, res) => {
//   const { code } = req.query;

//   try {
//     const { tokens } = await oauth2Client.getToken(code);

//     // Setelah sukses, redirect ke Frontend sambil kirim token
//     res.redirect(
//       `${FRONTEND_URL}/?token=${tokens.access_token}&refresh=${tokens.refresh_token}`
//     );
//   } catch (err) {
//     console.error("❌ Gagal Autentikasi Google:", err.response?.data || err);
//     res.status(500).json({ error: "Gagal autentikasi Google" });
//   }
// });

// export default router;

import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import { prisma } from "../../db/database.js"; // Sesuaikan path
import { authMiddleware } from "../../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI =
  process.env.REDIRECT_URI || "http://localhost:5000/api/google/callback";
const FRONTEND_URL = "http://localhost:5173";

// Export client agar bisa dipakai di file lain (step.js)
export const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

// --- [1] ROUTE LOGIN ---
// Gunakan authMiddleware di sini karena yang akses adalah Frontend App kamu
router.get("/google", authMiddleware, (req, res) => {
  const userId = req.user.userId; // Ambil ID user dari JWT

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // WAJIB: agar dapat refresh_token
    prompt: "consent", // WAJIB: agar google memaksa generate refresh_token baru
    scope: SCOPES,
    state: userId.toString(), // PENTING: Titip userId di sini
  });

  // res.redirect(url);
  res.status(200).json({ url });
});

// --- [2] ROUTE CALLBACK ---
// JANGAN PAKAI authMiddleware DI SINI. Google yang akses, bukan App kamu.
router.get("/callback", async (req, res) => {
  const { code, state } = req.query; // 'state' berisi userId yang kita titip tadi

  if (!state || !code) {
    return res.status(400).json({ error: "Invalid callback data" });
  }

  try {
    // 1. Tukar 'code' dengan tokens (access & refresh token)
    const { tokens } = await oauth2Client.getToken(code);

    // 2. Simpan Refresh Token ke Database berdasarkan userId (state)
    // Kita simpan access token juga untuk cache, tapi refresh token yang paling penting.
    await prisma.user.update({
      where: { id: parseInt(state) }, // Convert state ke Int
      data: {
        googleRefreshToken: tokens.refresh_token,
        googleAccessToken: tokens.access_token,
      },
    });

    console.log("✅ Google Fit Connected for User ID:", state);

    // 3. Redirect user kembali ke dashboard Frontend
    res.redirect(`${FRONTEND_URL}/`);
  } catch (err) {
    console.error("❌ Gagal Autentikasi Google:", err);
    res.redirect(`${FRONTEND_URL}/?error=google_auth_failed`);
  }
});

export default router;
