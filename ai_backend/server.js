// you should must run `npm install cors dotenv express`
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { analyzeGoal } = require("./ai-agents");
const storage = require("./storage");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// api endpoints
app.post("/api/goals/", async (req, res) => {
  try {
    const { goalText, durationDays } = req.body;
    if (!goalText || !durationDays) {
      return res.status(400).json({ error: `Goal & Duration are required` });
    }
    const plan = await analyzeGoal(goalText, durationDays);

    const goal = storage.saveGoal({
      title: goalText,
      durationDays,
      status: "active",
      plan,
    });

    const task = storage.saveTasks(goal.id, goal.plan.dailyTasks);
    storage.saveProgress(goal.id, {
      goalId: goal.id,
      completedTask: 0,
      totalTask: task.length,
      progressPercent: 0,
    });
    res.json(plan);
  } catch (err) {
    console.error(err);
  }
});

// ============ SERVER START ============
app.listen(PORT, () => {
  console.log(`🚀 AI Task Agent running on http://localhost:${PORT}`);
});
