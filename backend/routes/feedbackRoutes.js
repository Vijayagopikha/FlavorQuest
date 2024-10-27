const express = require("express");
const Feedback = require("../models/Feedback");
const router = express.Router();

// Add a new feedback
router.post("/", async (req, res) => {
  const { mealId, username, email, feedback } = req.body; // Updated to include username and email
  try {
    const newFeedback = new Feedback({ mealId, username, email, feedback }); // Updated object to include username and email
    await newFeedback.save();
    res.status(201).json({ message: "Feedback added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add feedback.", error });
  }
});

// Get feedback for a specific meal
router.get("/:mealId", async (req, res) => {
  const { mealId } = req.params;
  try {
    const feedbacks = await Feedback.find({ mealId });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback.", error });
  }
});

module.exports = router;
