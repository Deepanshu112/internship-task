import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

router.post("/", authMiddleware, async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    userId: req.userId,
  });
  res.json(task);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(task);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });
  res.json({ message: "Task deleted" });
});

export default router;
