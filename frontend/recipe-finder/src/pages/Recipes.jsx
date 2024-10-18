import React, { useState } from "react";
import "./Recipes.css"; // Link to your CSS file
import '@fortawesome/fontawesome-free/css/all.min.css';

const Recipes = () => {
  const [meals, setMeals] = useState([]);
  const [query, setQuery] = useState('');  // Use state to hold the search query
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return; // Ensure the search query isn't empty
    
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await response.json();
      setMeals(data.meals || []); // Update state with meal data
    } catch (error) {
      console.error('Error fetching meals:', error);
      setMeals([]);
    }
  };

  const showMealDetails = (meal) => {
    setSelectedMeal(meal);
  };

  const closeRecipe = () => {
    setSelectedMeal(null);
  };

  return (
    <div className="container">
      <div className="meal-wrapper">
        <h2 className="title">Find Your Recipe</h2>

        <div className="meal-search">
          <cite>Search your favorite meal</cite>
          <form className="meal-search-box" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-control"
              placeholder="Enter meal name..."
              value={query} // Bind the input to query state
              onChange={(e) => setQuery(e.target.value)} // Update query state on input change
            />
            <button type="submit" className="search-btn">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>

        <div className="meal-result" id="meal">
          {meals.length > 0 ? (
            meals.map((meal) => (
              <div key={meal.idMeal} className="meal-item">
                <div className="meal-img">
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                </div>
                <div className="meal-name">
                  <h3>{meal.strMeal}</h3>
                  <button
                    className="recipe-btn"
                    onClick={() => showMealDetails(meal)}
                  >
                    Get Recipe
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="notFound">No meals found.</div>
          )}
        </div>

        {selectedMeal && (
          <div className="meal-details showRecipe">
            <button className="recipe-close-btn" onClick={closeRecipe}>
              &times;
            </button>
            <div className="meal-details-content">
              <h2 className="recipe-title">{selectedMeal.strMeal}</h2>
              <p className="recipe-category">{selectedMeal.strCategory}</p>
              <div className="recipe-instruct">
                <p>{selectedMeal.strInstructions}</p>
              </div>
              <div className="recipe-meal-img">
                <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
              </div>
              <div className="recipe-link">
                <a href={selectedMeal.strSource} target="_blank" rel="noreferrer">
                  View Full Recipe
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
