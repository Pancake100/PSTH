import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Edit, User, LogOut, ChevronUp } from 'lucide-react';
import '../css/UserPage.css';

export default function UserPage({ user, onLogout }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('http://localhost:3000/');
  };
  
  const dashboardItems = [
    { name: 'My Schedule', icon: Calendar, path: '/schedule', className: 'card-schedule' },
    { name: 'My Assignments', icon: Edit, path: '/assignments', className: 'card-assignments' },
    { name: 'Library', icon: BookOpen, path: '/library', className: 'card-library' },
    { name: 'Booking', icon: User, path: '/booking', className: 'card-booking' },
  ];

  if (!user) {
    return <div>Loading user data or user not found...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      <aside className={`profile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="profile-header">
          <img src={user.avatarUrl} alt="User Avatar" className="profile-avatar" />
          <div>
            <h3 className="profile-name">{user.name}</h3>
            <p className="profile-role">{user.role}</p>
          </div>
        </div>
        <div style={{ flexGrow: 1 }}>
          <div className="info-box"><h4>User Info</h4><p>{user.info}</p></div>
          <div className="info-box"><h4>Notifications</h4><p>No new notifications.</p></div>
        </div>
        <div className="profile-dropdown-container">
          <div className={`profile-dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
            <Link to="/profile" className="dropdown-item"><User className="dropdown-item-icon" /> Profile</Link>
            {/* The Settings link has been removed */}
            <Link to="/" onClick={onLogout} className="dropdown-item logout"><LogOut className="dropdown-item-icon" /> Logout</Link>
          </div>
          <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="profile-dropdown-button">
            <span>{user.name}</span>
            <ChevronUp style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="header">
          <div><h1>DigitalAcademy</h1><p>Welcome, {user.name}!</p></div>
          
        </header>
        <div className="dashboard-grid">
          {dashboardItems.map((item) => (
            <Link key={item.name} to={item.path} className={`dashboard-card ${item.className}`}>
              <div className="card-icon-wrapper"><item.icon className="card-icon" /></div>
              <h3 className="card-title">{item.name}</h3>
              <p className="card-description">Access your {item.name.toLowerCase()}.</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
