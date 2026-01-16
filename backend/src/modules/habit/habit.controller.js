import {
  getAllHabits,
  addHabit,
  updateHabitTitle,
  removeHabit,
  toggleHabitStatus,
} from "./habit.service.js";

export const getHabitsController = async (req, res) => {
  try {
    const { weekStart } = req.query;
    const userId = req.user.userId;

    const habits = await getAllHabits(userId, weekStart);
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createHabitController = async (req, res) => {
  try {
    const { title, weekStart } = req.body;
    const userId = req.user.userId;

    const habit = await addHabit(title, weekStart, userId);
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateHabitController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;

    const habit = await updateHabitTitle(id, req.body.title, userId);
    res.json(habit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Status (Done/Undone)
export const updateHabitStatusController = async (req, res) => {
  try {
    const id = Number(req.params.id); // Ini sekarang ID Habit
    const { done } = req.body;
    const userId = req.user.userId;

    const result = await toggleHabitStatus(id, done, userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteHabitController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;

    const result = await removeHabit(id, userId);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
