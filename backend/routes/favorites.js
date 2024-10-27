// routes/favorites.js
const express = require('express');
const Favorites = require('../models/Favorites'); // Adjust the path based on your structure
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, mealName } = req.body;

  if (!email || !mealName) {
    return res.status(400).json({ msg: 'Email and meal name are required' });
  }

  try {
    // Check if the favorite meal already exists for the user
    const favorite = await Favorites.findOne({ email, mealName: { $in: Array.isArray(mealName) ? mealName : [mealName] } });

    if (favorite) {
      // Meal already exists in favorites
      return res.status(409).json({ msg: 'Meal already in favorites', favorite });
    }

    // If meal doesn't exist, update the user's favorites
    const updatedFavorite = await Favorites.findOneAndUpdate(
      { email },  // Find the document by email
      { $addToSet: { mealName: { $each: Array.isArray(mealName) ? mealName : [mealName] } } },  // Append mealName(s) to array, avoid duplicates
      { upsert: true, new: true }  // Create new document if it doesn't exist
    );

    res.status(201).json({ msg: 'Favorite added successfully', favorite: updatedFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});



router.post('/getAll', async (req, res) => {

  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const favorite = await Favorites.findOne({ email });

    if (!favorite) {
      return res.status(404).json({ error: 'No favorite meals found for this email' });
    }

    res.status(200).json({ mealNames: favorite.mealName });
  } catch (error) {
    console.error('Error retrieving favorite meals:', error);
    res.status(500).json({ error: 'An error occurred while retrieving favorite meals' });
  }
});


module.exports = router;
