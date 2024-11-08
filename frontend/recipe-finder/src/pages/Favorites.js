import React, { useEffect, useState } from "react";
import "./Recipes.css"; // Assuming you're using the same CSS
import { useNavigate } from "react-router-dom";
import { REACT_APP_BACKEND_URL } from "../constants/constant";
import './i18n'; 

import { useTranslation } from 'react-i18next';
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showMeal, setShowMeal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  
  const userEmail = localStorage.getItem('userEmail');
  const username =localStorage.getItem('username');


  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { t } = useTranslation();


  // Fetch favorite meals based on their names
  useEffect(() => {
    const fetchFavoriteMeals = async () => {
            setLoading(true); // Start loading
      const fetchedMeals = await Promise.all(
        favorites.map(async (mealName) => {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
          const data = await response.json();
          return data.meals ? data.meals[0] : null;
        })
      );
      setMeals(fetchedMeals.filter(Boolean));
      setLoading(false); // End loading after meals are fetched
    };

    if (favorites.length > 0) {
      fetchFavoriteMeals();
    } else {
      setLoading(false); // End loading if there are no favorites
    }
  }, [favorites]);

  // Fetch favorite meals from the backend
  useEffect(() => {
    const fetchFavorites = async () => {
      setReviews('');
      setLoading(true); // Start loading
      try {
        const response = await fetch(`${REACT_APP_BACKEND_URL}/api/favorites/getAll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail })
        });

        const data = await response.json();
        
        if (response.ok && data.mealNames) {
          setFavorites(data.mealNames);
        } else {
          console.error("Error fetching favorites:", data.error);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchFavorites();
  }, [userEmail]);


  // Show meal ingredients
  const showMealIngredients = (meal) => {
    setSelectedMeal(meal);
    setShowIngredients(true);
  };

  // Show meal details (recipe)
  const showMealDetails = (meal) => {
    setSelectedMeal(meal);
    setShowMeal(true);
  };

  // Close recipe modal
  const closeRecipe = () => setShowMeal(false);

  // Close feedback modal
  const closeModal = () => {
    setShowReviewsModal(false);
    setShowFeedbackModal(false);
  };

  // Render the ingredients
  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      if (ingredient) ingredients.push(ingredient);
    }
    return ingredients;
  };

 
// Function to handle removal of a favorite meal
const handleRemoveFavorite = async (mealName) => {
  if (window.confirm("Are you sure you want to remove this meal from favorites?")) {
    try {
      // Remove from frontend state
      setFavorites((prevFavorites) => prevFavorites.filter(name => name !== mealName));

      // Send DELETE request to backend to remove from database
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/favorites/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, mealName }),  // Send email and mealName
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.msg);
      } else {
        console.error(result.msg);
      }
    } catch (error) {
      console.error("Error removing favorite meal:", error);
    }
  }
};


  return (
    <div className="container">
    <nav className="navbar">
      <button className="back-btn" onClick={() => navigate(-1)}>{t('back')}</button>
     
      <div className="user-info">
        {username && <span className="username">{username}</span>}
      </div>
      
    </nav>
    
    <div className="meal-wrapper">
      <h2 className="title">Your Favorite Meals</h2>

      <div className="meal-result" id="meal">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div> {/* Rotating loader centered */}
          </div>
        ) : meals.length > 0 ? (
          meals.map((meal) => (
            <div key={meal.idMeal} className="meal-item" style={{ position: 'relative' }}>
              <div className="meal-img">
                <img src={meal.strMealThumb} alt={meal.strMeal} />
              </div>
              <div className="meal-name">
                <h3>{meal.strMeal}</h3>
                <button
                  className="favorites-btn"
                  onClick={() => handleRemoveFavorite(meal.strMeal)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'black',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '40px',
                      height: '40px',
                      border: `2px solid red`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <i className="fa fa-heart" style={{ fontSize: '24px', color: 'red' }}></i>
                  </div>
                </button>
                <div className="button-group">
                  <button className="recipe-btn" onClick={() => showMealDetails(meal)}>
                  {t('getRecipe')}
                  </button>
                  <button className="ingredients-btn" onClick={() => showMealIngredients(meal)}>
                  {t('getIngredients')}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="notFound">No favorite meals added yet.</div>
        )}
      </div>

      {showIngredients && selectedMeal && (
        <div className="meal-details-dynamic showRecipe">
          <button className="recipe-close-btn" onClick={() => setShowIngredients(false)}>&times;</button>
          <div className="meal-details-content">
            <h3>{t('ingredients')}</h3>
            <ol>
              {getIngredients(selectedMeal).map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {selectedMeal && showMeal && (
        <div className="meal-details showRecipe">
          <button className="recipe-close-btn" onClick={closeRecipe}>&times;</button>
          <div className="meal-details-content">
            <h2 className="recipe-title">{selectedMeal.strMeal}</h2>
            <p className="recipe-category">{selectedMeal.strCategory}</p>
            <div className="recipe-instruct">
              <p>{selectedMeal.strInstructions}</p>
            </div>
            <div className="recipe-meal-img">
              <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
            </div>
            <div className="recipe-buttons">
              {selectedMeal.strYoutube && (
                <a href={selectedMeal.strYoutube} target="_blank" rel="noreferrer" className="btn-video">
                  Video Link
                </a>
              )}
              <button className="btn-reviews" onClick={() => setShowReviewsModal(true)}>
                Reviews
              </button>
              <button className="btn-feedback" onClick={() => setShowFeedbackModal(true)}>
                Add Your Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            <h3>Reviews</h3>
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <strong>{review.name}</strong>
                <p>{review.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            <h3>Add Your Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
            ></textarea>
            <button className="submit-feedback-btn">Submit Feedback</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Favorites;
