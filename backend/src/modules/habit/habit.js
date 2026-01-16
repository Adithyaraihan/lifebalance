import express from "express";
import { prisma } from "../../db/database.js";

const router = express.Router();

// GET semua habit (opsional filter weekStart)
router.get("/", async (req, res) => {
  try {
    const { weekStart } = req.query;

    const habits = await prisma.habit.findMany({
      where: weekStart ? { weekStart: new Date(weekStart) } : {},
      include: { progress: true }, // sertakan progress terkait
      orderBy: { id: "asc" },
    });

    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST buat habit baru
router.post("/", async (req, res) => {
  try {
    const { title, weekStart, userId } = req.body;

    if (!title || !weekStart) {
      return res.status(400).json({ error: "Title dan weekStart wajib diisi" });
    }

    const habit = await prisma.habit.create({
      data: {
        title,
        weekStart: new Date(weekStart),
        userId: userId, // default userId 1
      },
    });

    // otomatis buat progress untuk 7 hari
    const progressData = Array.from({ length: 7 }, (_, day) => ({
      habitId: habit.id,
      day,
      done: false,
    }));
    await prisma.habitProgress.createMany({ data: progressData });

    // ambil kembali habit beserta progress
    const habitWithProgress = await prisma.habit.findUnique({
      where: { id: habit.id },
      include: { progress: true },  
    });

    res.status(201).json(habitWithProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update habit (misal title)
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;

    if (!title) return res.status(400).json({ error: "Title wajib diisi" });

    const habit = await prisma.habit.update({
      where: { id },
      data: { title },
      include: { progress: true },
    });

    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE habit beserta progress
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.habit.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Habit tidak ditemukan" });

    // hapus semua progress terkait
    await prisma.habitProgress.deleteMany({ where: { habitId: id } });

    // hapus habit
    await prisma.habit.delete({ where: { id } });

    res.json({ message: "Habit beserta progress dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
