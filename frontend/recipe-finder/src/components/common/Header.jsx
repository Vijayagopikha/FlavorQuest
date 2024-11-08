// Header.jsx
import '../../pages/i18n'; 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported
import './Header.css'; // Import your CSS for Header styles
import { REACT_APP_BACKEND_URL } from '../../constants/constant';


import { useTranslation } from 'react-i18next';



const Header = (props) => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Modal state for login
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // Modal state for signup
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { emailOrUsername, password } = formData;
  const { username, email, password: signupPassword } = signupData;

  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const changeLanguage = (lang) => {
      i18n.changeLanguage(lang);
      setDropdownOpen(false); // Close the dropdown after selecting a language
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if(formData.emailOrUsername==="admin@gmail.com" && formData.password==="admin"){
      console.log("hoi");
      navigate('/admin');
    }else{
      try {
      const res = await axios.post(`${REACT_APP_BACKEND_URL}/api/auth/login`, formData);
      alert('Logged in successfully');
      console.log(res.data); // Token or success response
      localStorage.setItem('token', res.data.token); // Store token
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('userEmail',formData.emailOrUsername);
      navigate('/recipe'); // Redirect to recipe page
    } catch (err) {
      console.error(err.response?.data || err); // Handle errors
      alert(err.response?.data.msg || 'Error logging in');
    }
  };
}

  const onSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${REACT_APP_BACKEND_URL}/api/auth/signup`, signupData);
      alert('Account created successfully');
      console.log(res.data); 
      // Success response
      closeSignupModal();
       // Close the modal after signup
       openLoginModal();
    } catch (err) {
      console.error(err.response?.data || err); // Handle errors
      alert(err.response?.data.msg || 'Error creating account');
    }
  };

  const openLoginModal = () =>{ setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setMessage(''); // Clear message on modal close
    setFormData({ emailOrUsername: '', password: '' }); // Reset form data
  };

  const openSignupModal = () => {setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);

  };
  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
    setSignupData({ username: '', email: '', password: '' }); // Reset signup form data
  };
 

 
  return (
    <div className={`header-container ${props.bgClass}`}>
      <div className="nav-links">
        <div className="left-links">
          <span className="company-name">{t('tasteterk')}</span>
          <Link to="/" className="home">{t('home')} </Link>
          <Link onClick={openLoginModal} className="recipe">{t('recipe')} </Link>
        </div>
        <div className="language-dropdown">
        <button className="dropdown-btn" onClick={toggleDropdown}>
                            {i18n.language === 'en' ? 'English' : i18n.language === 'ta' ? 'தமிழ்' : 'हिन्दी'}
                        </button>
        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={() => changeLanguage('en')}>English</button>
                                <button onClick={() => changeLanguage('ta')}>தமிழ்</button>
                                <button onClick={() => changeLanguage('hi')}>हिन्दी</button>
                            </div>
                        )}
                         </div>
        <div className="right-links">
          <Link className="login" onClick={openLoginModal}>{t('login')} </Link>
          <Link className="signup" onClick={openSignupModal}>{t('signup')} </Link>
        </div>
      </div>

      <div className="text-content">
        <h1 className="header-title" >{props.title}</h1>
        <h1 className="header-subtitle">{props.subtitle}</h1>
        {props.children}
      </div>

      {/* Modal for login */}
      {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="login-modal">
            <button className="close-modal-btn" onClick={closeLoginModal}>&times;</button>
            <div className="login-form">
              <h2>Login</h2>
              <form onSubmit={onSubmit}>
                <div>
                  <label>Email or Username</label>
                  <input
                    type="text"
                    name="emailOrUsername"
                    value={emailOrUsername}
                    onChange={onChange}
                    required
                  />
                </div>
                <div>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </div>
                <button type="submit">Login</button>
              </form>
              {message && <p>{message}</p>}
              <p>Don't have an account? <Link onClick={openSignupModal}>Sign up here</Link></p>
            </div>
          </div>
        </div>
      )}

      {/* Modal for signup */}
      {isSignupModalOpen && (
        <div className="modal-overlay">
          <div className="signup-modal">
            <button className="close-modal-btn" onClick={closeSignupModal}>&times;</button>
            <div className="signup-form">
              <h2>Sign Up</h2>
              <form onSubmit={onSignupSubmit}>
                <div>
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={onSignupChange}
                    required
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onSignupChange}
                    required
                  />
                </div>
                <div>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={signupPassword}
                    onChange={onSignupChange}
                    required
                    minLength="6"
                  />
                </div>
                <button type="submit">Create Account</button>
              </form>
              {message && <p>{message}</p>}
              <p>Already have an account? <Link onClick={openLoginModal}>Login here</Link></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
