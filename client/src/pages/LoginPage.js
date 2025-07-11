import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/App.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(`/${role}/${username}`);
  };

  return (
    <div>
      <h2>Login Page</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
