import {
  getDataSleep,
  createDataSleep,
  CalculateScoreSleep,
} from "./scoreSleep.service.js";

export const getDataSleepController = async (req, res) => {
  try {
    const sleeps = await getDataSleep(req.user.userId);
    res.status(200).json({ sleeps });
  } catch (err) {
    res.status(500).json({ meesage: "gagal mengambil data" });
  }
};

export const createDataSleepController = async (req, res) => {
  try {
    const { hours } = req.body;

    if (!hours || isNaN(hours)) {
      return res.status(400).json({ error: "Jam tidur tidak valid." });
    }

    const today = new Date().toISOString().split("T")[0];
    const date = new Date(today);

    const saved = await createDataSleep(
      date,
      parseFloat(hours),
      req.user.userId
    );

    return res.json({
      message: "Data tidur hari ini tersimpan.",
      sleep: saved,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Gagal menyimpan data." });
  }
};

// mengambil 7 data yang sudah dihitung
export const getScoreSleepController = async (req, res) => {
  try {
    const scoreData = await CalculateScoreSleep(req.user.userId, 7);
    res.status(200).json(scoreData);
  } catch (err) {
    res.status(500).json({ error: err.message || "Gagal menghitung skor." });
  }
};
