import React, { useState } from "react";
import "./Recipes.css"; // Link to your CSS file
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";


const Recipes = () => {
  const [meals, setMeals] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showMeal, setshowMeal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || ''); // State for username input
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || ''); // State for email input
  const [message, setMessage] = useState(''); // Message to show submission status
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return;

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setMeals([]);
    }
  };

  const showMealDetails = (meal) => {
    setSelectedMeal(meal);
    setshowMeal(true);
    setShowReviewsModal(false);
    setShowIngredients(false);
  };

  const closeRecipe = () => {
    setSelectedMeal(null);
  };

  const showMealIngredients = (meal) => {
    setSelectedMeal(meal);
    setshowMeal(false);
    setShowReviewsModal(false);
    setShowIngredients(true);
  };
  

  const submitFeedback = async () => {
    if (feedback.trim() && username.trim() && email.trim()) {
      try {
        const response = await fetch('http://localhost:5000/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mealId: selectedMeal.idMeal,
            username, // Assuming username is being used instead of name
            email,
            feedback,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        alert("Feedback submitted successfully!");
        setFeedback(''); // Clear feedback input
        
        setShowFeedbackModal(false); // Close feedback modal after submission
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert("Error submitting feedback. Please try again.");
      }
    } else {
      alert("Please fill in all fields: Meal ID, Username, Email, and Feedback.");
    }
  };
  
  
  /*const handleFavorites = (meal) => {
    if (favorites.includes(meal.idMeal)) {
      setFavorites(favorites.filter(fav => fav !== meal.idMeal));
    } else {
      setFavorites([...favorites, meal.idMeal]);
    }
  };*/
  const handleFavorites = async (meal) => {
    // Check if the meal is already in favorites
    const isFavorite = favorites.some(fav => fav.idMeal === meal.idMeal);
    const userEmail = localStorage.getItem('userEmail');
    if (isFavorite) {
      // Remove the meal from favorites
      setFavorites(favorites.filter(fav => fav.idMeal !== meal.idMeal));
    } else {
      // Add the meal to favorites
      setFavorites([...favorites, meal]);
       // Get user email from local storage
       try {
        // Send the email and meal name to the backend
        await axios.post('http://localhost:5000/api/favorites', {
          email: userEmail,
          mealName: meal.strMeal
        });
        alert(`${meal.strMeal} added to favorites!`);
      } catch (error) {
        console.error('Error adding favorite:', error);
        alert('Error adding favorite. Please try again.');
      }
    }
  };

  const reviews = [
    { id: 1, name: "John Doe", feedback: "Amazing recipe! I loved it." },
    { id: 2, name: "Jane Smith", feedback: "Simple and delicious." },
    { id: 3, name: "Alice Johnson", feedback: "Tried this with my family, and it was a hit!" },
    { id: 4, name: "Chris Lee", feedback: "Easy to follow, and the taste was great!" }
  ];

  const handleReviews = () => {
    setShowReviewsModal(true);
  };
  
  const handleFeedbackModal = () => {
    setShowFeedbackModal(true);
  };

  const closeModal = () => {
    setShowReviewsModal(false);
    setShowFeedbackModal(false);
  };

  // Function to get the ingredients
  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(` ${measure ? measure + ' ' : ''}${ingredient}`);
      }
    }
    return ingredients;
  };

  const handleLogout = () => {
    window.location.href = '/';
  }
  return (
    <div className="container">
      <nav className="navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <Link to="/fov" className="favourites">Favourites</Link>
        {/* <div className="user-info">
    {username && <span className="username">Welcome, {username}!</span>}
  </div> */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
      <div className="meal-wrapper">
        <h2 className="title">Find Your Recipe</h2>

        <div className="meal-search">
          <cite>Search your favorite meal</cite>
          <form className="meal-search-box" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-control"
              placeholder="Enter meal name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>

        <div className="meal-result" id="meal">
          {meals.length > 0 ? (
            meals.map((meal) => (
              <div key={meal.idMeal} className="meal-item" style={{ position: 'relative' }}>
                <div className="meal-img">
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                </div>
                <div className="meal-name">
                  <h3>{meal.strMeal}</h3>
                  <button
                    className="favorites-btn"
                    onClick={() => handleFavorites(meal)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'black',
                      cursor: 'pointer',
                      position: 'absolute', // Make the button position absolute
                      top: '10px', // Position it from the top
                      right: '10px', // Position it from the right
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '40px',
                        height: '40px',
                        border: `2px solid ${favorites.some(fav => fav.idMeal === meal.idMeal) ? 'red' : 'black'}`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color 0.3s ease',
                      }}
                    >
                      <i
                        className={`fa ${favorites.some(fav => fav.idMeal === meal.idMeal) ? 'fa-heart' : 'fa-heart'}`}
                        style={{
                          fontSize: '24px',
                          color: favorites.some(fav => fav.idMeal === meal.idMeal) ? 'red' : 'black',
                          transition: 'color 0.2s',
                        }}
                      ></i>
                    </div>
                  </button>
                  <div className="button-group">
                    <button className="recipe-btn" onClick={() => showMealDetails(meal)}>
                      Get Recipe
                    </button>
                    <button className="ingredients-btn" onClick={() => showMealIngredients(meal)}>
                      Get Ingredients
                    </button>
                  </div>
                </div>
              </div>

            ))
          ) : (
            <div className="notFound">No meals found.</div>
          )}
        </div>
        {showIngredients && (
          <div className="meal-details-dynamic showRecipe">
            <button className="recipe-close-btn" onClick={() => setShowIngredients(false)}>
              &times;
            </button>
            <div className="meal-details-content">
              <h3>Ingredients:</h3>
              <ol >
                {getIngredients(selectedMeal).map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ol>
            </div>
          </div>
        )}



        {selectedMeal && showMeal && (
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
              <div className="recipe-buttons">
                {selectedMeal.strYoutube && (
                  <a
                    href={selectedMeal.strYoutube}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-video"
                  >
                    Video Link
                  </a>
                )}
                <button className="btn-reviews" onClick={handleReviews}>
                  Reviews
                </button>
                <button className="btn-feedback" onClick={handleFeedbackModal}>Add Your Feedback</button>
              </div>

              {/* Reviews Modal */}
              {showReviewsModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <button className="modal-close-btn" onClick={closeModal}>
                      &times;
                    </button>
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
              <button className="submit-feedback-btn" onClick={submitFeedback}>Submit Feedback</button>
            </div>
          </div>
        )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
