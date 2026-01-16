import { getStepsService } from "../services/googleFit.service.js";

export const getStepsController = async (req, res) => {
  try {
    const stepsData = await getStepsService(req.user.userId);
    res.json({ activityData: stepsData });
  } catch (err) {
    console.error("❌ Step Controller Error:", err);
    res.status(500).json({ error: "Gagal mengambil data langkah" });
  }
};
