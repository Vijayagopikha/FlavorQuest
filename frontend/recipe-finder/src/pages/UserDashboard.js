import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDashboard.css";
import { FaUserCircle, FaPencilAlt } from "react-icons/fa";
import { REACT_APP_BACKEND_URL } from "../constants/constant";
import './i18n'; 

import { useTranslation } from 'react-i18next';
const UserDashboard = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        setFavoritesCount(response.data.count);
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
    fetchFavoritesCount();
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
      <button className="backs-btn" onClick={() => navigate(-1)}>{t('back')}</button>

      <div className="user-icon-container">
        <FaUserCircle className="user-icon" />
        <FaPencilAlt className="edit-icon" onClick={handleEditToggle} />
      </div>

      <div className="dashboard-section">
        <h2>{t('profileTitle')}</h2>
        
        {isEditing ? (
          <div className="edit-form">
            <div className="form-field">
              <label><p><strong>{t('username')}</strong></p></label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label><p><strong>{t('email')}</strong></p></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label><p><strong>{t('dob')}</strong></p></label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label><p><strong>{t('phoneNumber')}</strong></p></label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>


            <div className="button-group">
              <button className="save-btn" onClick={handleEditToggle}>{t('saveChanges')}</button>
              <button className="cancel-btn" onClick={handleSaveChanges}>{t('cancelChanges')}</button>
            </div>
          </div>
        ) : (
          <>
          <br>
          </br>
          <div className="dash">
  <p3><strong>{t('username')}</strong></p3>
  <p3>{username}</p3><br />
  <p3><strong>{t('email')}</strong></p3>
  <p3>{email}</p3><br />
  <p3><strong>{t('dob')}</strong></p3>
  <p3>{dob}</p3><br />
  <p3><strong>{t('phoneNumber')}</strong></p3>
  <p3>{phoneNumber}</p3><br />
</div>

          </>
        )}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h3>{t('yourActivity')}</h3>
          <p><strong>{t('totalFavorites')}</strong> {favoritesCount}</p>
        </div>

        <div className="dashboard-section">
          <h3>{t('recommendedForYou')}</h3>
          {recommendations.length > 0 ? (
            <ul>
              {recommendations.map((recipe) => (
                <li key={recipe.id}>
                  <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('noRecommendations')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;