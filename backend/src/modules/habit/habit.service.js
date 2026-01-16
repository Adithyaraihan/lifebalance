import {
  getHabits,
  createHabitRepo,
  findHabitById,
  updateHabitTitleRepo,
  updateHabitStatusRepo,
  deleteHabitRepo,
} from "./habit.repository.js";

export const getAllHabits = (userId, weekStart) => {
  return getHabits(userId, weekStart);
};

export const addHabit = async (title, weekStart, userId) => {
  if (!title || !weekStart) {
    throw new Error("Title dan weekStart wajib diisi");
  }

  const startDate = new Date(weekStart);

  // Langsung simpan habit (tidak perlu generate progress harian lagi)
  return await createHabitRepo(title, startDate, userId);
};

export const updateHabitTitle = async (id, title, userId) => {
  if (!title) throw new Error("Title wajib diisi");
  
  const habit = await findHabitById(id);
  if (!habit) throw new Error("Habit tidak ditemukan");
  if (habit.userId !== userId) throw new Error("Unauthorized");

  return updateHabitTitleRepo(id, title);
};

// Fitur Checklist (Sekarang mengupdate Habit ID langsung)
export const toggleHabitStatus = async (id, done, userId) => {
  if (typeof done !== 'boolean') {
    throw new Error("Status done harus boolean (true/false)");
  }

  const habit = await findHabitById(id);
  if (!habit) throw new Error("Habit tidak ditemukan");
  if (habit.userId !== userId) throw new Error("Unauthorized");

  return await updateHabitStatusRepo(id, done);
};

export const removeHabit = async (id, userId) => {
  const habit = await findHabitById(id);
  if (!habit) throw new Error("Habit tidak ditemukan");
  if (habit.userId !== userId) throw new Error("Unauthorized");

  await deleteHabitRepo(id);

  return { message: "Habit berhasil dihapus" };
};