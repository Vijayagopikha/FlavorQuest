// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const { emailOrUsername, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      setMessage('Logged in successfully');
      console.log(res.data); // Token or success response
    } catch (err) {
      console.error(err.response.data);
      setMessage(err.response.data.msg || 'Error logging in');
    }
  };

  return (
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
      <p>Don't have an account? <a href="/signup">Sign up here</a></p>
    </div>
  );
};

export default Login;
