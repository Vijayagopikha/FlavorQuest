const express = require("express");
const Feedback = require("../models/Feedback");
const router = express.Router();

// Add a new feedback
router.post("/", async (req, res) => {
  const { mealId, username, email, feedback, rating } = req.body; 
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

router.post("/getmealrate", async (req, res) => {
  const { mealId } = req.body;
  try {
    const feedbacks = await Feedback.find({ mealId });

    // Calculate the average rating if needed
    const averageRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length;

    // Map feedbacks to include only necessary fields
    const feedbackDetails = feedbacks.map(feedback => ({
      rating: feedback.rating,
      username: feedback.username,
      feedback: feedback.feedback,
    }));
    
    res.json({
      feedbacks: feedbackDetails,
      averageRating: isNaN(averageRating) ? 0 : averageRating, // Provide average rating if available
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback.", error });
  }
});



module.exports = router;