import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Login from './components/Login'
import Registration from './components/Registration'
import Jobs from './components/Jobs'

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setLoggedIn(!!token)
  }, [])

  const handleLogin = (token) => {
    // Set the token in localStorage and update the login state
    localStorage.setItem('token', token)
    setLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setLoggedIn(false)
  }

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/registration">Registration</Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link to="/jobs">Jobs</Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/"/>
          <Route path="/login" element={<Login onLogin={(token) => handleLogin(token)} />} />
          <Route path="/registration" element={<Registration />} />
          {isLoggedIn && <Route path="/jobs" element={<Jobs />} />}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
