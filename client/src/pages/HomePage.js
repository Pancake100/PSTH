import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

function HomePage() {
  // Get the navigate function from the router
  const navigate = useNavigate();

  /**
   * This function handles the navigation to the login page.
   * It's called when the user clicks the login button.
   */
  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>PSTH</h1>
        <p>PSTH an online platform that provides a comprehensive and user-friendly experience for both students and teachers.</p>
      </header>
      <main className="homepage-main">
        {/* The button now calls our new function on click */}
        <button onClick={handleNavigateToLogin} className="homepage-login-button">
          Login
        </button>
      </main>
    </div>
  );
}

export default HomePage;
