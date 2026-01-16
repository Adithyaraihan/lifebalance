import {
  createWeightHeight,
  getBMIScore,
  getWeightHeight,
} from "./bmi.service.js";

export const getWeightHeightController = async (req, res) => {
  try {
    const take = parseInt(req.query.take) || undefined;

    const daftarBerat = await getWeightHeight(take, req.user.userId);

    res.status(200).send(daftarBerat);
  } catch (error) {
    return res.status(500).json({ error: "Gagal mengambil data." });
  }
};

export const createWeightHeightController = async (req, res) => {
  try {
    const { weightKg, heightCm } = req.body;

    const weight = Number(weightKg);
    const height = Number(heightCm);

    const newdata = await createWeightHeight(weight, height, req.user.userId);

    res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: newdata,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBMIController = async (req, res) => {
  try {
    const BMI_Score = await getBMIScore(req.user.userId);

    res.status(200).send(BMI_Score);
  } catch (error) {
    return res.status(500).json({ error: "Gagal mengambil data." });
  }
};
