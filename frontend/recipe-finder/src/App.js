import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Recipes from './pages/Recipes';
import Favorites from "./pages/Favorites";
import Home from './pages/Home';
import Login from'./pages/Login.css';
import Signup from './pages/Signup.css';
import './App.css';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/Admin';

const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe" element={<Recipes />} />
          <Route path="/fov" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
  );
};

export default App;