import fetch from "node-fetch";
import { getChats, saveChat, deleteChats } from "./aiChat.repository.js";

export const getAnswerAi = async (userid) => {
  return await getChats(userid);
};

export const fetchAIAnswer = async (question, userId) => {
  if (!question) throw new Error("Question cannot be empty");

  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
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
2. Jawaban harus panjang & mendetail.
3. Gunakan bahasa positif, profesional, dan menyemangati.
`,
          },
          { role: "user", content: question },
        ],
      }),
    }
  );

  const data = await response.json();
  const answer =
    data?.choices?.[0]?.message?.content || "AI tidak memberikan jawaban.";

  // simpan ke database
  const chat = await saveChat(question, answer, userId);

  return chat;
};

export const deleteAllHistoryChats = async (userId) => {
  deleteChats(userId);
};
