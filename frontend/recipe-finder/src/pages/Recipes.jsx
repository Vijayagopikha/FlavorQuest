import React, { useState, useEffect } from "react";
import "./Recipes.css"; // Link to your CSS file
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../constants/constant";
import './i18n'; 

import { useTranslation } from 'react-i18next';

const Recipes = () => {
  const [meals, setMeals] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showMeal, setShowMeal] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0); // Initialize rating to 0 or any default value
  const [reviews, setReviews] = useState([]); // State to store reviews from the backend
  const [loading, setLoading] = useState(false); // Add loading state
  const [searchType, setSearchType] = useState('mainDish');
  const [areas, setAreas] = useState([]);
  const [area, setSelectedArea] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  //review based filter
  const [avgrating, setAvgRating] = useState(0);
  const [selectedRate, setSelectedRate] = useState(0);
 

  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const email =localStorage.getItem('userEmail') || '';

 
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleSearch1 = async (e) => {
    e.preventDefault();
    const ingredients = query.split(',').map(ingredient => ingredient.trim().toLowerCase());
    if (ingredients.length === 0) return;

    setLoading(true); // Set loading to true when starting the fetch
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${ingredients[0]}`);
      const data = await response.json();
      let filteredMeals = data.meals || [];

      for (let i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];

        filteredMeals = filteredMeals.filter(meal => {
          for (let j = 1; j <= 20; j++) {
            const mealIngredient = meal[`strIngredient${j}`]?.toLowerCase();
            if (mealIngredient && mealIngredient.includes(ingredient)) return true;
          }
          return false;
        });

        if (filteredMeals.length === 0) break;
      }

      setMeals(filteredMeals);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setMeals([]);
    } finally {
      setLoading(false); // Set loading to false when fetch is done
    }
  };
 
   // Fetch areas (for area search type)
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        const data = await response.json();
        setAreas(data.meals || []);
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    };

    fetchAreas();
  }, []);


 

    // Handle area-based search
    const handleSearch2 = async (e, area) => {
      e.preventDefault();
      setLoading(true); // Set loading to true when starting the fetch
  
      try {
        // Fetch meals filtered by the specified area
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const data = await response.json();
        
        const mealAreas = data.meals || []; // Set an empty array if meals is undefined
  
        // Fetch ingredient details for each meal
        const mealsWithIngredients = await Promise.all(mealAreas.map(async (meal) => {
          // Fetch details for each meal (including ingredients)
          const mealDetailsResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
          const mealDetailsData = await mealDetailsResponse.json();
          const mealDetails = mealDetailsData.meals[0] || {};
          
          return mealDetails;
        }));
  
        setMeals(mealsWithIngredients); // Store meals with ingredient details
      } catch (error) {
        console.error('Error fetching meals by area:', error);
        setMeals([]); // Clear previous filtered meals data if there’s an error
      } finally {
        setLoading(false); // Set loading to false when fetch is done
      }
    };
  
  

  // Fetch categories (for category search type)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const data = await response.json();
        setCategories(data.meals || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

// Handle search by category
const handleSearch3 = async (category) => {
  if (!category) return;

  setLoading(true); // Set loading to true when starting the fetch

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    
    const mealsByCategory = data.meals || []; // Set an empty array if meals is undefined

    // Fetch ingredient details for each meal
    const mealsWithIngredients = await Promise.all(mealsByCategory.map(async (meal) => {
      // Fetch details for each meal (including ingredients)
      const mealDetailsResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const mealDetailsData = await mealDetailsResponse.json();
      const mealDetails = mealDetailsData.meals[0] || {};

      return mealDetails;
    }));

    setMeals(mealsWithIngredients); // Store meals with ingredient details
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    setMeals([]); // Clear previous meals data if there’s an error
  } finally {
    setLoading(false); // Set loading to false when fetch is done
  }
};

//search by review
const handleSearch4 = async (e, rate) => {
  setLoading(true);
  const recipeArray = [
    ["Arrabiata", "Beef and Mustard Pie", "Chicken Congee", "Chilli Crab", "Duck Confit", "Egg Drop Soup", "French Onion Soup", "Garlic Prawns", "Honey Balsamic Lamb", "Indian Naan"],
    ["Jamaican Jerk Chicken", "Katsu Curry", "Lamb Tagine", "Moussaka", "Nachos", "Oyakodon", "Pad Thai", "Quiche Lorraine", "Ratatouille", "Shakshuka"],
    ["Spaghetti Bolognese", "Tandoori Chicken", "Vegetable Frittata", "Walnut Roll", "Yakitori", "Zucchini Slice", "Apple Frangipan Tart", "BBQ Pork Sloppy Joes", "Chicken Fajita Mac and Cheese", "Dundee Cake"],
    ["Eggplant Adobo", "Fish Pie", "General Tso's Chicken", "Honey Teriyaki Salmon", "Irish Stew", "Jerk Chicken", "Kapsalon", "Laksa King Prawn Noodles", "Massaman Beef Curry", "Nasi lemak"],
    ["Osso Buco", "Pasta Carbonara", "Quinoa Salad", "Risotto alla Milanese", "Sushi", "Tacos", "Udon Noodles", "Vindaloo", "Wontons", "Yellow Curry"]
  ];

  const allRecipes = [];

  // Get the specific row based on rowIndex
  const selectedRow = recipeArray[rate - 1];

  for (let recipeName of selectedRow) {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
      const data = await response.json();

      if (data.meals) {
        // If recipe details exist, add them to the allRecipes array
        allRecipes.push(data.meals[0]);
      }
    } catch (error) {
      console.error(`Error fetching data for ${recipeName}:`, error);
    }
  }
  setLoading(false);
  setMeals(allRecipes);
}


  //calling
  const handleSearch = async (e) => {
    e.preventDefault();
  
    switch (searchType) {
      case 'mainDish':
        await handleSearch1(e);
        break;

        case 'ingredients':
          await handleSearch1(e);
          break;
        
      case 'area':
        await handleSearch2(e,area);
        break;
        
      case 'category':
        await handleSearch3(selectedCategory);
        break;
      
      case 'rating':
        await handleSearch4(e,selectedRate);
        break;
        
      default:
        console.error("Invalid search type");
    }
  };
  
  
  //dashboard
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const showMealDetails = (meal) => {
    setSelectedMeal(meal);
    setShowMeal(true);
    setShowReviewsModal(false);
    setShowIngredients(false);
  };

  const closeRecipe = () => {
    setSelectedMeal(null);
  };

  const showMealIngredients = (meal) => {
    setSelectedMeal(meal);
    setShowMeal(false);
    setShowReviewsModal(false);
    setShowIngredients(true);
  };

  useEffect(() => {
    // Fetch all feedback data from backend
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/feedback`);
        setReviews(response.data); // Populate reviews with fetched data
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };
    fetchFeedbackData();
  }, []);

  const submitFeedback = async () => {
    if (feedback.trim() && username.trim() && email.trim() && rating) {
      try {
        const response = await fetch(`${REACT_APP_BACKEND_URL}/api/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mealId: selectedMeal.idMeal,
            username,
            email,
            feedback,
            rating,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        alert('feedback submitted successfullly');
       
        setFeedback(''); // Clear feedback input
        setRating(0); // Clear rating after submission
        setShowFeedbackModal(false); // Close feedback modal after submission
         // Refresh feedback data after submission
         const newFeedback = {
          username,
          feedback,
          rating,
        };
        setReviews([...reviews, newFeedback]); // Add new feedback to the displayed list
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    } else {
      alert("Please fill Feedback.");
    }
  };

  const handleFavorites = async (meal) => {
    const isFavorite = favorites.some(fav => fav.idMeal === meal.idMeal);
    const userEmail = localStorage.getItem('userEmail');

    if (isFavorite) {
      // Remove the meal from favorites
      setFavorites(favorites.filter(fav => fav.idMeal !== meal.idMeal));
    } else {
      // Add the meal to favorites
      setFavorites([...favorites, meal]);
      try {
        await axios.post(`${REACT_APP_BACKEND_URL}/api/favorites`, {
          email: userEmail,
          mealName: meal.strMeal
        });

        alert(`The meal ${meal.strMeal} is added to your favorites!`);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert('This meal is already in your favorites!');
        } else {
          console.error('Error adding favorite:', error);
          alert('Error adding favorite. Please try again.');
        }
      }
    }
  };

  /*const reviews = [
    { id: 1, name: "John Doe", feedback: "Amazing recipe! I loved it." },
    { id: 2, name: "Jane Smith", feedback: "Simple and delicious." },
    { id: 3, name: "Alice Johnson", feedback: "Tried this with my family, and it was a hit!" },
    { id: 4, name: "Chris Lee", feedback: "Easy to follow, and the taste was great!" }
  ];*/

  const handleReviews = async (mealId) => {
    setShowReviewsModal(true);
    try {
      // Send request to the API to fetch meal reviews by mealId
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/feedback/getmealrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealId }),
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to fetch meal reviews');
      }

      // Parse the response JSON
      const data = await response.json();

      // Store reviews and average rating separately
      setReviews(data.feedbacks); // Array of feedbacks
      setAvgRating(data.averageRating); // Average rating value
    } catch (error) {
      console.error('Error fetching meal reviews:', error);
      setReviews('');
      setAvgRating(0); // Return default values in case of an error
    }
  };



  const handleFeedbackModal = () => {
    setShowFeedbackModal(true);
  };

  const closeModal = () => {
    setShowReviewsModal(false);
    setShowFeedbackModal(false);
  };

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

  // Get the placeholder based on the search type
  const getPlaceholder = () => {
    switch (searchType) {
      case 'mainDish':
        return t('searchByMainDish');
      case 'ingredients':
        return t('searchByIngredients');
      case 'area':
        return  t('selectArea');
      case 'category':
        return t('selectCategory'); 
      case 'rating':
        return t('selectRating'); 
      default:
        return '';
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>{t('back')}</button>
        <Link to="/fov" className="favourites">{t('favorites')}</Link>
        <Link to="/user">
        <div className="user-info">

          {username && <span className="username">{username}</span>}
        </div>
        </Link>
        <button className="logout-btn" onClick={handleLogout}>{t('logout')}</button>
      </nav>
      <div className="meal-wrapper">
        <h2 className="title">{t('findYourRecipe')}</h2>

        <div className="meal-search">
          <cite>{t('searchYourFavoriteMeal')}</cite>
          <form className="meal-search-box" onSubmit={handleSearch}>
      <div className="search-options">
        <select
          className="search-type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          
          <option value="mainDish">{t('byMainDish')}</option>
          <option value="ingredients">{t('byIngredients')}</option>
          <option value="area">{t('byArea')}</option>
          <option value="category">{t('byCategory')}</option>
          <option value="rating">{t('byRating')}</option>
        </select>
      </div>

      {/* Show dropdown for Area search type */}
      {searchType === 'area' && (
        <select
          className="search-control"
          value={query}
          onChange={(e) => {setSelectedArea(e.target.value);
          setQuery(e.target.value);
          }}
        >
          <option value="">{t('selectArea')}</option>
          {areas.map((area) => (
            <option key={area.strArea} value={area.strArea}>
              {area.strArea}
            </option>
          ))}
        </select>
      )}

      {/* Show dropdown for Category search type */}
      {searchType === 'category' && (
        <select
          className="search-control"
          value={query}
          onChange={(e) => {setQuery(e.target.value);setSelectedCategory(e.target.value);}}
        >
          <option value="">{t('selectCategory')}</option>
          {categories.map((category) => (
            <option key={category.strCategory} value={category.strCategory}>
              {category.strCategory}
            </option>
          ))}
        </select>
      )}

      {/* For Main Dish and Ingredients, just an input box */}
      {(searchType === 'mainDish' || searchType === 'ingredients') && (
        <input
          type="text"
          className="search-control"
          placeholder={getPlaceholder()}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}
      {/* For Main Dish and Ingredients, just an input box */}
      {(searchType === 'mainDish' || searchType === 'ingredients') && (
              <input
                type="text"
                className="search-control"
                placeholder={getPlaceholder()}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
            {searchType === 'rating' && (
              <select
                className="search-control"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedRate(e.target.value);
                }
                }
              >
                <option value="">Select Rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            )}

      <button type="submit" className="search-btn">
        <i className="fa fa-search"></i>
      </button>
    </form>
  </div>

        <div className="meal-result" id="meal">
          {loading ? (
             <div className="loader-container">
             <div className="loader"></div> {/* Rotating loader centered */}
           </div>) : meals.length > 0 ? (
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
            <div className="notFound">{t('noMealsFound')}</div>
          )}
        </div>

        {showIngredients && (
          <div className="meal-details-dynamic showRecipe">
            <button className="recipe-close-btn" onClick={() => setShowIngredients(false)}>
              &times;
            </button>
            <div className="meal-details-content">
              <h3>{t('ingredients')}</h3>
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
                   {t('videoLink')}
                  </a>
                )}
                {searchType!=='rating' &&<button className="btn-reviews" onClick={(e) => { handleReviews(selectedMeal.idMeal); }}>
                  {t('reviews')}
                </button>}
                <button className="btn-feedback" onClick={handleFeedbackModal}>{t('addYourFeedback')}</button>
              </div>

              
              {showReviewsModal  && (
                <div className="modal">
                  <h2> {t('reviews')}</h2>
                  <button onClick={closeModal}>✖</button>
                  { reviews!='' ? <ul>
                    {reviews.map((review, index) => (
                      <li key={index}>
                        <div>
                          <p style={{ fontWeight: 'bold', color: 'black' }}>
                            <strong>Username:</strong> {review.username}

                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <strong>Feedback:</strong> {review.feedback}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <strong>Rating:</strong> {review.rating}
                          </p>
                         
                        </div>

                      </li>
                    ))}
                     <p style={{ fontWeight: 'bold', color: 'black' }}>
                            <strong >Average Rating:</strong> {avgrating}
                          </p>
                  </ul> : <p style={{color:'white'}}><strong>No Reviews Found</strong></p>}
                </div>
              )}
             {showFeedbackModal && (
        <div className="modal">
          <h2>{t('submitFeedback')}</h2>
          <button onClick={closeModal}>✖</button>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t('writeFeedbackPlaceholder')}
          />
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder={t('ratePlaceholder')}
            min="1"
            max="5"
          />
          <button onClick={submitFeedback}>Submit</button>
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
