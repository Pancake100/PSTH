import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import UserPage from './pages/UserPage';
import LibraryPage from './pages/LibraryPage';
import ProfilePage from './pages/ProfilePage';
import AssignmentsPage from './pages/AssignmentsPage';
import BookingPage from './pages/BookingPage';
import SchedulePage from './pages/SchedulePage';
import LessonPage from './pages/LessonPage';

import './css/App.css';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  // Add a loading state to wait for session storage check
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in session storage only once when the app loads
    try {
      const savedUser = sessionStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem('user'); // Clear corrupted data
    }
    setIsLoading(false); // Finished checking, ready to render
  }, []);

  useEffect(() => {
    // This effect runs whenever the user state changes to keep session storage in sync
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);
  const handleUpdateUser = (updatedUserData) => setUser(updatedUserData);

  // Show a global loading screen until the initial user check is complete
  if (isLoading) {
    return <div className="global-loader">Loading DigitalAcademy...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUpPage onLogin={handleLogin} />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute user={user}><UserPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute user={user}><LibraryPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><ProfilePage user={user} onUpdateUser={handleUpdateUser} /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute user={user}><AssignmentsPage user={user} /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute user={user}><BookingPage user={user} /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute user={user}><SchedulePage user={user} /></ProtectedRoute>} />
        <Route path="/lesson/:bookingId" element={<ProtectedRoute user={user}><LessonPage user={user} /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
