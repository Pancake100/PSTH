import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import LibraryPage from './pages/LibraryPage';

import './css/App.css';

export default function App() {
  // State to hold the logged-in user's data
  const [user, setUser] = useState(null);

  // This function will be called by LoginPage on successful login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // This function will be called from the UserPage to log out
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <UserPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/library"
          element={<LibraryPage />}
        />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}
