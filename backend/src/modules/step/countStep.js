import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ error: "Token otorisasi tidak ditemukan" });
  }

  try {
    const aggregate = await axios.post(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      {
        aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
        bucketByTime: { durationMillis: 86400000 }, // Per hari
        startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 hari
        endTimeMillis: Date.now(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const buckets = aggregate.data.bucket ?? [];

    const formattedData = buckets.map((b) => {
      const steps = b.dataset[0].point.reduce(
        (sum, p) => sum + (p.value[0]?.intVal || 0),
        0
      );

      const date = new Date(parseInt(b.startTimeMillis)).toLocaleDateString(
        "id-ID",
        { weekday: "short", day: "2-digit", month: "short" }
      );

      return { date, steps };
    });

    // ❗ Kembalikan dengan key yang sama seperti FE sebelumnya
    res.json({ activityData: formattedData });

  } catch (err) {
    console.error("❌ GOOGLE FIT ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Gagal mengambil data langkah" });
  }
});

export default router;
