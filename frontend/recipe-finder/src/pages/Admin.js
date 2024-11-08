import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Admin.css';
import { REACT_APP_BACKEND_URL } from "../constants/constant";
import './i18n'; 

import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]); // State to store recipes

  const navigate = useNavigate();
  const { t } = useTranslation();
  // Fetch the current list of recipes when the component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/recipes`);
        setRecipes(response.data); // Set fetched recipes to state
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes');
      }
    };

    fetchRecipes();
  }, []);

  // Function to handle form submission (including image upload)
  const handleAddRecipe = async () => {
    setLoading(true);
    const newRecipe = { name, category, instructions, image };

    try {
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/recipes/add`, newRecipe);
      alert('Recipe added successfully!');
      // Add the new recipe to the top of the list dynamically
      setRecipes((prevRecipes) => [response.data, ...prevRecipes]); // Add to top of the list
      setName('');
      setCategory('');
      setInstructions('');
      setImage('');
    } catch (err) {
      setError('Failed to add the recipe');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    console.log('Deleting recipe with ID:', recipeId); // Add this log to debug
    try {
      const response = await axios.delete(`${REACT_APP_BACKEND_URL}/api/recipes/delete/${recipeId}`);
      if (response.status === 200) {
        setRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe._id !== recipeId));
        alert('Recipe deleted successfully!');
      } else {
        alert('Failed to delete the recipe');
      }
    } catch (err) {
      console.error('Failed to delete the recipe:', err);
      setError('Failed to delete the recipe');
    }
  };
  const handleLogout = () => {
    window.location.href = '/';
  }

  return (
    <div className="admin-dashboard">
       
    <nav className="navbar">
      <button className="back-btn" onClick={() => navigate(-1)}>{t('back')}</button>
    
      <button className="logout-btn" onClick={handleLogout}>{t('logout')}</button>
      
      
    </nav>
      
      <center><div className="dashboard-title">Admin Dashboard</div></center>
      
      <center><div className="add-recipe-section">
        <h2>Add a New Recipe</h2>
        <br>
        </br>
        <div className="input-group">
          <input
            type="text"
            placeholder="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="input-field"
          />
          <input
            type="url"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="input-field"
          />
          <button onClick={handleAddRecipe} className="add-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Recipe'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div></center>

      {/* Newly Added Recipes */}
      <div className="recipes-section">
        <br>
        </br>
        <div className='dash'>Newly Added Recipes</div>
        <br>
        </br>
        {recipes.length > 0 ? (
          <div className="recipes-list">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card">
                {recipe.image && <img src={recipe.image} alt={recipe.name} className="recipe-img" />}
                <br>
                </br>
                <div className='recipe-title'>{recipe.name}</div>
                <span className="recipe-category">{recipe.category}</span>
                <p className="recipe-instructions">{recipe.instructions}</p>
                <br></br>
               <button onClick={() => handleDeleteRecipe(recipe._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No recipes added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;