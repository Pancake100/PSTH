import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/SignupPage.css';

const allSubjects = ['Maths', 'English', 'Science', 'Biology', 'Chemistry', 'History'];

export default function SignUpPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState(9);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubjectToggle = (subject) => {
    setSubjects(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { role, name, username, password, grade, subjects };
    try {
      const response = await fetch('http://localhost:5001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data);
        navigate('/dashboard');
      } else {
        setError(data.message || "Failed to sign up.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <h1 className="signup-title">Create Your Account</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group"><label htmlFor="name">Full Name</label><input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="input-group"><label htmlFor="username">Username</label><input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
          <div className="input-group"><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <div className="input-group"><label htmlFor="role">I am a...</label><select id="role" value={role} onChange={(e) => setRole(e.target.value)}><option value="student">Student</option><option value="teacher">Teacher</option></select></div>
          
          {role === 'student' && (
            <div className="input-group"><label htmlFor="grade">Grade</label><select id="grade" value={grade} onChange={(e) => setGrade(e.target.value)}><option>9</option><option>10</option><option>11</option><option>12</option></select></div>
          )}

          {role === 'teacher' && (
            <div className="input-group"><label>Subjects I Teach</label><div className="subject-selector">{allSubjects.map(s => (<button type="button" key={s} onClick={() => handleSubjectToggle(s)} className={`subject-tag ${subjects.includes(s) ? 'active' : ''}`}>{s}</button>))}</div></div>
          )}

          <button type="submit" className="signup-button">Sign Up</button>
          {error && <div className="error">{error}</div>}
        </form>
        <p className="login-link">Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    </div>
  );
}
