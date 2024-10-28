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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
