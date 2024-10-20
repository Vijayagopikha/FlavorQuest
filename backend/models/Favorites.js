const mongoose = require('mongoose');

const FavoritesSchema = new mongoose.Schema({
  email: { type: String, required: true },
  mealName: { type: String, required: true },
});

const Favorites = mongoose.model('Favorites', FavoritesSchema);
module.exports = Favorites;
