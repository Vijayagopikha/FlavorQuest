// routes/favorites.js
const express = require('express');
const Favorites = require('../models/Favorites'); // Adjust the path based on your structure
const router = express.Router();

// Favorite recipes endpoint
router.post('/', async (req, res) => {
  const { email, mealName } = req.body;
  console.log(email);
  console.log(mealName);

  if (!email || !mealName) {
    return res.status(400).json({ msg: 'Email and meal name are required' });
  }

  try {
    const favorite = new Favorites({ email, mealName });
    await favorite.save();
    res.status(201).json({ msg: 'Favorite added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
