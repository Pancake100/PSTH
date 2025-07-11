import React from 'react';
import './HomePage.css'; // Make sure to create and link this CSS file

/**
 * The HomePage component.
 * @param {object} props - The props for the component.
 * @param {function} props.onNavigateToLogin - A function to call when the login button is clicked.
 */
export default function HomePage({ onNavigateToLogin }) {
  return (
    <div className="homepage-container">
      <h1>Welcome to Your School Portal</h1>
      <p>Please Login to Continue</p>
      <button onClick={onNavigateToLogin}>Login</button>
    </div>
  );
}
