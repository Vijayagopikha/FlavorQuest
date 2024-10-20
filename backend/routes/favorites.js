// routes/favorites.js
const express = require('express');
const Favorites = require('../models/Favorites'); // Adjust the path based on your structure
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, mealName } = req.body;

  console.log(email);
  console.log(mealName);

  if (!email || !mealName) {
    return res.status(400).json({ msg: 'Email and meal name are required' });
  }

  try {
    // Update the user's favorites by adding the meal name to the array
    const favorite = await Favorites.findOneAndUpdate(
      { email },  // Find the document by email
      { $addToSet: { mealName: { $each: Array.isArray(mealName) ? mealName : [mealName] } } },  // Append mealName(s) to array, avoid duplicates
      { upsert: true, new: true }  // Create new document if it doesn't exist
    );

    res.status(201).json({ msg: 'Favorite added successfully', favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
