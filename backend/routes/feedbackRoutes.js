const express = require("express");
const Feedback = require("../models/Feedback");
const router = express.Router();

// Add a new feedback
router.post("/", async (req, res) => {
  const { mealId, username, email, feedback, rating } = req.body; // Updated to include username and email
  // Validate rating
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }
  try {
    const newFeedback = new Feedback({ mealId, username, email, feedback, rating }); // Updated object to include username and email
    await newFeedback.save();
    res.status(201).json({ message: "Feedback added successfully!" });
    
  } catch (error) {
    res.status(500).json({ message: "Failed to add feedback.", error });
  }
});

router.get("/:mealId", async (req, res) => {
  const { mealId } = req.params;
  try {
    const feedbacks = await Feedback.find({ mealId });

    // Optionally, you can calculate the average rating for the meal
    const averageRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length;

    res.json({
      feedbacks,
      averageRating: isNaN(averageRating) ? 0 : averageRating, // Provide average rating if available
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback.", error });
  }
});


module.exports = router;
