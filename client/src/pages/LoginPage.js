import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Note: We are not using a dedicated CSS file for login in this structure,
// but you can add one if you like.

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // onLogin is passed from App.js to set the user state
        onLogin(data);
        navigate('/dashboard'); // Navigate to dashboard on successful login
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again later.");
      console.error("Login fetch error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="site-name">School Portal</div>
        <div className="role-select">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
