// Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import your CSS for Header styles

const Header = (props) => {
    return (
        <div className={`header-container ${props.bgClass}`}>
            <div className="nav-links">
                <div className="left-links">
                    <span className="company-name">TasteTrek</span> {/* Added company name */}
                    <Link to="/" className="home">HOME</Link>
                    <Link to="/recipe" className="recipe">RECIPE</Link>
                </div>
                <div className="right-links">
                    <Link to="/login" className="login">LOGIN</Link>
                    <Link to="/signup" className="signup">SIGNUP</Link>
                </div>
            </div>

            <div className="text-content">
                <h1 className="header-title">{props.title}</h1>
                {props.children}
            </div>
        </div>
    );
}

export default Header;
