import express from "express";
import axios from "axios";
import { prisma } from "../../db/database.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { oauth2Client } from "../googlefit/login.js"; // Import oauth client yang sama

const router = express.Router();

// Middleware Auth wajib di sini karena ini request dari Frontend
router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    // 1. Ambil data user dari DB untuk mendapatkan Refresh Token
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { googleRefreshToken: true },
    });

    if (!user || !user.googleRefreshToken) {
      return res.status(400).json({
        error:
          "Google Fit belum terhubung. Silakan login Google Fit terlebih dahulu.",
      });
    }

    // 2. Set Credentials ke OAuth Client menggunakan Refresh Token dari DB
    oauth2Client.setCredentials({
      refresh_token: user.googleRefreshToken,
    });

    // 3. Dapatkan Access Token Baru (Otomatis handle refresh jika expired)
    const { token } = await oauth2Client.getAccessToken();

    if (!token) {
      return res
        .status(401)
        .json({ error: "Gagal memperbarui sesi Google Fit" });
    }

    // 4. Request ke Google Fit API menggunakan token baru
    // Kita gunakan axios seperti kodemu, tapi tokennya dari backend process
    const aggregate = await axios.post(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      {
        aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
        bucketByTime: { durationMillis: 86400000 }, // 1 Hari
        startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 Hari lalu
        endTimeMillis: Date.now(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Token segar dari oauth2Client
          "Content-Type": "application/json",
        },
      }
    );

    // 5. Formatting Data (Sama seperti kodemu)
    const buckets = aggregate.data.bucket ?? [];
    const formattedData = buckets.map((b) => {
      const steps = b.dataset[0].point.reduce(
        (sum, p) => sum + (p.value[0]?.intVal || 0),
        0
      );
      const adjustedTime = parseInt(b.startTimeMillis) + 86400000;

      const date = new Date(adjustedTime).toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });

      return { date, steps };
    });

    res.json({ activityData: formattedData });
  } catch (err) {
    if (err.response?.status === 401 || err.message.includes("invalid_grant")) {
      return res
        .status(401)
        .json({ error: "Sesi Google Fit habis, silakan hubungkan ulang." });
    }

    res.status(500).json({ error: "Gagal mengambil data langkah" });
  }
});

export default router;
