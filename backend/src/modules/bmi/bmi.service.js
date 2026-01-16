import { findData, findLatestData, insertData } from "./bmi.repository.js";

export const getWeightHeight = async (take, userId) => {
  return await findData(take, userId);
};

export const createWeightHeight = async (weight, height, userId) => {
  if (!weight || !height) {
    throw new Error("weight dan height wajib diisi");
  }

  return await insertData(weight, height, userId);
};

export const getBMIScore = async (userId) => {
  const user = await findLatestData(userId);

  const weight = user.weightKg;
  const height = user.heightCm / 100;

  const BMIScore = (weight / (height * height)).toFixed(2);

  let Status_Berat_Badan;

  if (BMIScore >= 30) Status_Berat_Badan = "Obesitas";
  if (BMIScore >= 25) Status_Berat_Badan = "kelebihan Berat Badan";
  if (BMIScore >= 18.5) Status_Berat_Badan = "Normal";
  else Status_Berat_Badan = "Obesitas";

  return { BMIScore, Status_Berat_Badan };
};
