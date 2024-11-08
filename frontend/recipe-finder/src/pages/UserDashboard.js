import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDashboard.css";
import { FaUserCircle, FaPencilAlt } from "react-icons/fa";
import { REACT_APP_BACKEND_URL } from "../constants/constant";

const UserDashboard = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [favoritesCount, setFavoritesCount] = useState(0);  // Store the favorites count
  const [recommendations, setRecommendations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // Fetch user details and favorites count
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/user?email=${email}`);
        const { dob, phoneNumber } = response.data;
        setDob(dob || '');
        setPhoneNumber(phoneNumber || '');
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchFavoritesCount = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/favorites?email=${email}`);
        setFavoritesCount(response.data.count);  // Update the favorites count
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/recommendations?email=${email}`);
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchUserDetails();
    fetchFavoritesCount();  // Fetch the favorites count
    fetchRecommendations();
  }, [email]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`${REACT_APP_BACKEND_URL}/api/users/update`, {
        username,
        email,
        dob,
        phoneNumber,
        password
      });

      localStorage.setItem('username', username);
      localStorage.setItem('userEmail', email);

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <button className="backs-btn" onClick={() => navigate(-1)}>Back</button>

      <div className="user-icon-container">
        <FaUserCircle className="user-icon" />
        <FaPencilAlt className="edit-icon" onClick={handleEditToggle} />
      </div>

      <div className="dashboard-section">
        <br>
        </br>
        <h3>Your Profile</h3>
        {isEditing ? (
          <div className="edit-form">
            {/* Profile edit form */}
            <label>
              <strong>Username:</strong>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              <strong>Email:</strong>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              <strong>Date of Birth:</strong>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </label>
            <label>
              <strong>Phone Number:</strong>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </label>
            <label>
              <strong>Change Your Password:</strong>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </label>
            <button className="cancel-btn" onClick={handleSaveChanges}>Cancel</button>
            <button className="save-btn" onClick={handleEditToggle}>Save</button>
          </div>
        ) : (
          <>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Date of Birth:</strong> {dob}</p>
            <p><strong>Phone Number:</strong> {phoneNumber}</p>
          </>
        )}
      </div>

       
        <div className="dashboard-content">
          <div className="dashboard-section">
            <h3>Your Activity</h3>
            <p><strong>Total Favorites: </strong> {favoritesCount}</p>
          </div>

          <div className="dashboard-section">
            <h3>Recommended for You</h3>
            {recommendations.length > 0 ? (
              <ul>
                {recommendations.map((recipe) => (
                  <li key={recipe.id}>
                    <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recommendations at the moment.</p>
            )}
          </div>
        </div>
      
    </div>
  );
};

export default UserDashboard;