import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data);
        navigate('/dashboard');
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h1 className="login-title">Welcome Back</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group"><label htmlFor="username">Username</label><input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
          <div className="input-group"><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <div className="input-group"><label htmlFor="role">Login as a...</label><select id="role" value={role} onChange={(e) => setRole(e.target.value)}><option value="student">Student</option><option value="teacher">Teacher</option></select></div>
          <button type="submit" className="login-button">Login</button>
          {error && <div className="error">{error}</div>}
        </form>
        <p className="signup-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}
