import React, { useState } from 'react';
import axios from 'axios'

const API_URL = 'http://localhost:3001'

const Login = ({ onLogin }) => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/users/login`, {
                email: userData.email,
                password: userData.password,
            })

            const { token } = response.data
            localStorage.setItem('token', token)

            console.log('User logged in successfully!')
            console.log('Token:', token)

            if (onLogin) {
                onLogin(token);
            }

        } catch (error) {
            console.error('Error logging in:', error)
        }
    }

    return (
        <div>
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
            <button type="button" onClick={handleLogin}>
            Login
            </button>
        </form>
        </div>
    )
}

export default Login