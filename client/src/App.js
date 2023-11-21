import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://your-api-url'; // Replace with your actual API URL

const App = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const [token, setToken] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegistration = async () => {
    try {
      await axios.post(`${API_URL}/users/create`, userData);
      console.log('User registered successfully!');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: userData.email,
        password: userData.password,
      });

      const { token } = response.data;
      setToken(token);

      console.log('User logged in successfully!');
      console.log('Token:', token);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <form>
        {/* Render registration form fields here */}
        <button type="button" onClick={handleRegistration}>Register</button>
      </form>

      <h2>Login</h2>
      <form>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default App;
