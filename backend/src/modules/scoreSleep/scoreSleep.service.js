import { findDataSleep, insertDataSleep } from "./scoreSleep.repository.js";

// Ambil semua data sleep (default 7 terakhir)
export const getDataSleep = async (userId) => {
  return await findDataSleep(userId);
};

// Simpan data sleep
export const createDataSleep = async (date, hours, userId) => {
  if (!hours || isNaN(hours)) {
    throw new Error("Jam tidur tidak valid.");
  }
  const data = insertDataSleep(date, hours, userId);
};

// Hitung skor tidur berdasarkan N hari terakhir (default 7 hari)
export const CalculateScoreSleep = async (userId, take = 7) => {
  const sleeps = await findDataSleep(userId, take);

  if (sleeps.length === 0) {
    throw new Error("Belum ada data tidur.");
  }

  const totalSleep = sleeps.reduce((sum, s) => sum + s.hours, 0);
  const avgSleep = totalSleep / sleeps.length;

  let score;
  if (avgSleep >= 8) score = 100;
  else if (avgSleep >= 7) score = 90;
  else if (avgSleep >= 6) score = 75;
  else if (avgSleep >= 5) score = 60;
  else score = 40;

  return {
    totalSleep: Number(totalSleep.toFixed(1)),
    avgSleep: Number(avgSleep.toFixed(1)),
    score,
  };
};
