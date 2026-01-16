import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { prisma } from "../../db/database.js";

dotenv.config();
const router = express.Router();

// =======================
// GET semua chat
// =======================
router.get("/", async (req, res) => {
  try {
    const chats = await prisma.aIChat.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// POST kirim pertanyaan ke AI
// =======================
router.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question cannot be empty" });

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          {
            role: "system",
            content: `
Kamu adalah mentor pribadi untuk aplikasi LifeBalance.
Tugasmu:
1. Memberikan saran lengkap dan panjang tentang kesehatan mental, fisik, dan produktivitas.
2. Jawaban harus terstruktur: gunakan poin, subjudul, contoh, dan tips praktis.
3. Jangan singkat; selalu berikan penjelasan mendetail agar pengguna benar-benar mengerti.
4. Gunakan bahasa yang positif, menyemangati, dan profesional.
5. Fokus membantu pengguna membangun kebiasaan sehat dan konsisten.
6. Jika memungkinkan, hubungkan saran dengan aktivitas harian, mindset, dan latihan fisik.
7. Berikan rekomendasi langkah-langkah konkrit, jangan hanya teori.
`
          },
          {
            role: "user",
            content: question,
          },
        ],
        max_new_tokens: 4200, // pastikan jawaban panjang
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    const answer = data?.choices?.[0]?.message?.content || "AI tidak memberikan jawaban.";

    // Simpan ke DB
    const chat = await prisma.aIChat.create({
      data: { question, answer },
    });

    res.json({ chat });
  } catch (err) {
    console.error("Server AI error:", err.message);
    res.status(500).json({ error: "Gagal menghubungi AI" });
  }
});

// =======================
// DELETE semua chat
// =======================
router.delete("/", async (req, res) => {
  try {
    await prisma.aIChat.deleteMany();
    res.json({ message: "Semua chat dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
