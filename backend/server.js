// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const favoritesRoute = require('./routes/favorites');
dotenv.config();

const authRoutes = require('./routes/auth');
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// Use the favorites route
app.use('/api/favorites', favoritesRoute);
//feedback
app.use("/api/feedback", feedbackRoutes);

app.get('/',(req,res)=>{
  res.send('Hello Makkalae! Welcome to receipe finder');
})
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


  //admin
  // Sample database (In reality, this would be a MongoDB or SQL database)
// Define a Schema for the Recipe
const recipeSchema = new mongoose.Schema({
  name: String,
  category: String,
  instructions: String,
  image: String,
});

// Create a Model from the Schema
const Recipe = mongoose.model('Recipe', recipeSchema);

// POST endpoint to add a new recipe
app.post('/api/recipes/add', async (req, res) => {
  const { name, category, instructions, image } = req.body;

  // Validation
  if (!name || !category || !instructions || !image) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create a new recipe
    const newRecipe = new Recipe({
      name,
      category,
      instructions,
      image,
    });

    // Save to MongoDB
    await newRecipe.save();

    // Respond with success
    res.status(201).json({ message: 'Recipe added successfully', recipe: newRecipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add recipe' });
  }
});

// Get all recipes (for testing)
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

app.delete('/api/recipes/delete/:id', async (req, res) => {
  const { id } = req.params; // Get the recipe ID from the URL parameter

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id); // Adjust for your model
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
