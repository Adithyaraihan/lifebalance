import express from "express";
import { prisma } from "../../db/database.js";

const router = express.Router();
// =============================
// GET SEMUA DATA
// =============================
router.get("/", async (req, res) => {
  try {
    const sleeps = await prisma.sleep.findMany({
      orderBy: { date: "desc" },
      take: 7,
    });

    res.json({ sleeps });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data tidur." });
  }
});

// =============================
// SIMPAN / UPDATE TIDUR HARI INI
// =============================
router.post("/", async (req, res) => {
  const { hours } = req.body;

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const dateObj = new Date(today);

  try {
    const saved = await prisma.sleep.upsert({ 
      where: { date: dateObj },
      update: { hours: parseFloat(hours) },
      create: { date: dateObj, hours: parseFloat(hours) },
    });

    return res.json({
      message: "Data tidur hari ini tersimpan.",
      sleep: saved,
    });
  } catch (err) {
    return res.status(500).json({ error: "Gagal menyimpan data." });
  }
});



// =============================
// HITUNG SKOR
// =============================
router.get("/score", async (req, res) => {
  try {
    const sleeps = await prisma.sleep.findMany({
      orderBy: { id: "asc" },
      take: 7,
    });

    if (sleeps.length === 0) {
      return res.json({ error: "Belum ada data tidur." });
    }

    const totalSleep = sleeps.reduce((sum, s) => sum + s.hours, 0);
    const avgSleep = totalSleep / sleeps.length;

    let score;
    if (avgSleep >= 8) score = 100;
    else if (avgSleep >= 7) score = 90;
    else if (avgSleep >= 6) score = 75;
    else if (avgSleep >= 5) score = 60;
    else score = 40;

    res.json({
      totalSleep: Number(totalSleep.toFixed(1)),
      avgSleep: Number(avgSleep.toFixed(1)),
      score,
    });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghitung skor." });
  }
});

export default router;
