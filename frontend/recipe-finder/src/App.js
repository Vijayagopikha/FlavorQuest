import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Recipes from './pages/Recipes';
import Favorites from "./pages/Favorites";
import Home from './pages/Home';
import './pages/Login.css';
import './pages/Signup.css';
import './App.css'
const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe" element={<Recipes />} />
          <Route path="/fov" element={<Favorites />} />
         
        </Routes>
      </Router>
  );
};

export default App;