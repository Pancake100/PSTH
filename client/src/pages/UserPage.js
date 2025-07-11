import React, { useState } from 'react';
import { BookOpen, Calendar, Edit, User, LogOut, ChevronLeft, Menu, Settings, ChevronUp } from 'lucide-react';
import '../css/UserPage.css'; 


const studentData = {
  name: "Student's Name",
  role: "Student",
  info: "Grade: ",
  avatarUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=`
};

const teacherData = {
  name: "Teacher's Name",
  role: "Teacher",
  info: "Subject: ",
  avatarUrl: `https://placehold.co/100x100/D4EDDA/155724?text=`
};


export default function App() {
  const [view, setView] = useState('home');
  const [userType, setUserType] = useState('student');

  const renderContent = () => {
    switch (view) {
      case 'student':
        return <UserDashboard user={studentData} setView={setView} />;
      case 'teacher':
        return <UserDashboard user={teacherData} setView={setView} />;
      case 'schedule':
        return <PlaceholderPage pageName="Schedule" setView={setView} userType={userType} />;
      case 'assignments':
        return <PlaceholderPage pageName="Assignments" setView={setView} userType={userType} />;
      case 'library':
        return <PlaceholderPage pageName="Library" setView={setView} userType={userType} />;
      case 'booking':
        return <PlaceholderPage pageName="Booking" setView={setView} userType={userType} />;
      default:
        return (
          <div className="home-page-container">
            <h1>Welcome to the Portal</h1>
            <p>Select a view to get started.</p>
            <div className="home-page-buttons">
              <button onClick={() => { setView('student'); setUserType('student'); }} className="student-button">
                View as Student
              </button>
              <button onClick={() => { setView('teacher'); setUserType('teacher'); }} className="teacher-button">
                View as Teacher
              </button>
            </div>
          </div>
        );
    }
  };

  return <div className="app-container">{renderContent()}</div>;
}



function UserDashboard({ user, setView }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

 
  const dashboardItems = [
    { name: 'My Schedule', icon: Calendar, page: 'schedule', className: 'card-schedule' },
    { name: 'My Assignments', icon: Edit, page: 'assignments', className: 'card-assignments' },
    { name: 'Library', icon: BookOpen, page: 'library', className: 'card-library' },
    { name: 'Booking', icon: User, page: 'booking', className: 'card-booking' },
  ];

  const ProfileSidebar = () => (
    <aside className={`profile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="profile-header">
            <img
                src={user.avatarUrl}
                alt="User Avatar"
                className="profile-avatar"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/E2E8F0/4A5568?text=U'; }}
            />
            <div>
                <h3 className="profile-name">{user.name}</h3>
                <p className="profile-role">{user.role}</p>
            </div>
        </div>
        <div className="info-section" style={{ flexGrow: 1 }}>
            <div className="info-box">
                <h4>User Info</h4>
                <p>{user.info}</p>
            </div>
            <div className="info-box">
                <h4>Notifications</h4>
                <p>No new notifications.</p>
            </div>
        </div>
        
        {}
        <div className="profile-dropdown-container">
            <div className={`profile-dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                <button className="dropdown-item">
                    <User className="dropdown-item-icon" /> Profile
                </button>
                <button className="dropdown-item">
                    <Settings className="dropdown-item-icon" /> Settings
                </button>
                <button onClick={() => setView('home')} className="dropdown-item logout">
                    <LogOut className="dropdown-item-icon" /> Logout
                </button>
            </div>
            <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="profile-dropdown-button">
                <span>{user.name}</span>
                <ChevronUp style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
        </div>
    </aside>
  );

  return (
    <div className="dashboard-wrapper">
      {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="sidebar-overlay open"></div>}
      
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Web Name</h1>
            <p>Welcome, {user.name}!</p>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="sidebar-toggle-button">
            <Menu />
          </button>
        </header>

        <div className="dashboard-grid">
          {dashboardItems.map((item) => (
            <div
              key={item.name}
              onClick={() => setView(item.page)}
              className={`dashboard-card ${item.className}`}
            >
              <div className="card-icon-wrapper">
                <item.icon className="card-icon" />
              </div>
              <h3 className="card-title">{item.name}</h3>
              <p className="card-description">Access your {item.name.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </main>
      
      <ProfileSidebar />
    </div>
  );
}


function PlaceholderPage({ pageName, setView, userType }) {
  return (
    <div className="placeholder-page">
      <button onClick={() => setView(userType)} className="back-button">
        <ChevronLeft className="back-button-icon" />
        Back to Dashboard
      </button>
      <div className="placeholder-content">
        <h1>{pageName}</h1>
        <p>placeholder page for {pageName}.</p>
        <p>content.</p>
      </div>
    </div>
  );
}
