import React from "react";
import { useNavigate } from "react-router-dom";
import "./Recipes.css"; // Assuming you're using the same CSS

const Favorites = ({ favorites, handleFavorites }) => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <nav className="navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      </nav>

      <h2>Your Favorite Meals</h2>

      <div className="meal-result">
        {favorites.length > 0 ? (
          favorites.map((meal) => (
            <div key={meal.idMeal} className="meal-item">
              <div className="meal-img">
                <img src={meal.strMealThumb} alt={meal.strMeal} />
              </div>
              <div className="meal-name">
                <h3>{meal.strMeal}</h3>
                <button
                  className="favorites-btn"
                  onClick={() => handleFavorites(meal)}
                  style={{ color: "red" }}
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No favorites added yet.</div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
