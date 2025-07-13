import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>DigitalAcademy</h1>
        <p>An online platform that provides a comprehensive and user-friendly experience for both students and teachers.</p>
      </header>
      <main className="homepage-main">
        <div className="homepage-actions">
            <button onClick={() => navigate('/login')} className="homepage-button primary">
                Login
            </button>
            <button onClick={() => navigate('/signup')} className="homepage-button secondary">
                Sign Up
            </button>
        </div>
      </main>
    </div>
  );
}
