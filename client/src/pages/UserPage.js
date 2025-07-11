import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Edit, User, LogOut, Menu, Settings, ChevronUp } from 'lucide-react';
import '../css/UserPage.css';

/**
 * The UserPage component displays the dashboard for a logged-in user.
 * @param {object} props - The props for the component.
 * @param {object} props.user - The logged-in user's data.
 * @param {function} props.onLogout - A function to call when the user logs out.
 */
export default function UserPage({ user, onLogout }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // This function calls the onLogout prop from App.js and navigates home
  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };
  
  const dashboardItems = [
    { name: 'My Schedule', icon: Calendar, path: '/schedule', className: 'card-schedule' },
    { name: 'My Assignments', icon: Edit, path: '/assignments', className: 'card-assignments' },
    { name: 'Library', icon: BookOpen, path: '/library', className: 'card-library' },
    { name: 'Booking', icon: User, path: '/booking', className: 'card-booking' },
  ];

  // If for some reason the user data is not available, show a loading or error state.
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
            <button className="dropdown-item"><User className="dropdown-item-icon" /> Profile</button>
            <button className="dropdown-item"><Settings className="dropdown-item-icon" /> Settings</button>
            <button onClick={handleLogoutClick} className="dropdown-item logout"><LogOut className="dropdown-item-icon" /> Logout</button>
          </div>
          <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="profile-dropdown-button">
            <span>{user.name}</span>
            <ChevronUp style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="header">
          <div><h1>Web Name</h1><p>Welcome, {user.name}!</p></div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="sidebar-toggle-button"><Menu /></button>
        </header>
        <div className="dashboard-grid">
          {dashboardItems.map((item) => (
            // Use Link for internal navigation
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
