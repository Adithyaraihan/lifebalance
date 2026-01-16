import express from "express";

const router = express.Router();

// =======================
// GET semua todo (tanpa login)
// =======================
router.get("/", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: 1 }, // default user 1
      orderBy: { deadline: "asc" },
    });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// POST tambah todo baru
// =======================
router.post("/", async (req, res) => {
  try {
    const { text, deadline } = req.body;

    const todo = await prisma.todo.create({
      data: {
        text,
        deadline: new Date(deadline),
        userId: 1, // default user 1
        completed: false, // wajib ada default
      },
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// PUT toggle selesai
// =======================
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.todo.findFirst({
      where: { id, userId: 1 },
    });

    if (!existing) {
      return res.status(404).json({ error: "Todo tidak ditemukan" });
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { completed: !existing.completed },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// DELETE todo
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.todo.findFirst({
      where: { id, userId: 1 },
    });

    if (!existing) {
      return res.status(404).json({ error: "Todo tidak ditemukan" });
    }

    await prisma.todo.delete({
      where: { id },
    });

    res.json({ message: "Todo dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
