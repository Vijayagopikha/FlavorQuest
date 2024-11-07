const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  mealId: {
    type: String,
    required: true,
  },
  username: {  // Changed from 'name' to 'username' for clarity
    type: String,
    required: true,
  },
  email: {  // Added email field
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  feedback: {
    type: String,
    required: true,
  },
  rating: {  // Added rating field
    type: Number,
    required: true,
    min: 1,  // Ensure rating is between 1 and 5
    max: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
