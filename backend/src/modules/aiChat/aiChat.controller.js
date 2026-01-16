import {
  deleteAllHistoryChats,
  fetchAIAnswer,
  getAnswerAi,
} from "./aiChat.service.js";

export const getChatsController = async (req, res) => {
  try {
    const list = await getAnswerAi(req.user.userId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const askAIController = async (req, res) => {
  try {
    const { question } = req.body;
    const chat = await fetchAIAnswer(question, req.user.userId);
    res.json({ chat });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteChatsController = async (req, res) => {
  try {
    await deleteAllHistoryChats(req.user.userId);
    res.json({ message: "Semua chat dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
