import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Edit, Save } from 'lucide-react';
import '../css/ProfilePage.css';

export default function ProfilePage({ user, onUpdateUser }) {
    // All hooks are now called at the top level, before any conditions.
    const [isEditing, setIsEditing] = useState(false);
    // Initialize state safely, in case the user prop is not yet available.
    const [name, setName] = useState('');
    const [info, setInfo] = useState('');
    const [message, setMessage] = useState('');

    // Use an effect to set the state once the user prop is available or changes.
    useEffect(() => {
        if (user) {
            setName(user.name);
            setInfo(user.info);
        }
    }, [user]);

    // The conditional return now happens *after* the hooks have been called.
    if (!user) {
        return <div className="profile-page-container"><h1>Loading...</h1></div>;
    }

    const handleSave = async () => {
        setMessage('');
        try {
            const response = await fetch(`http://localhost:5001/api/users/${user.role}/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, info }),
            });
            if (!response.ok) throw new Error('Failed to update profile.');
            
            const updatedUser = await response.json();
            onUpdateUser(updatedUser); // Update the user state in App.js
            
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);

        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="profile-page-container">
            <div className="profile-page-header">
                <Link to="/dashboard" className="back-button">
                    <ChevronLeft /> Dashboard
                </Link>
                <h1>My Profile</h1>
            </div>

            <div className="profile-card">
                <div className="profile-avatar-large">
                    <img src={user.avatarUrl} alt="User Avatar" />
                </div>
                
                <div className="profile-details">
                    <div className="detail-item">
                        <label>Name</label>
                        {isEditing ? (
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        ) : (
                            <p>{user.name}</p>
                        )}
                    </div>
                    <div className="detail-item">
                        <label>{user.role === 'teacher' ? 'Subject' : 'Details'}</label>
                        {isEditing ? (
                            <input type="text" value={info} onChange={(e) => setInfo(e.target.value)} />
                        ) : (
                            <p>{user.info}</p>
                        )}
                    </div>
                    <div className="detail-item">
                        <label>Role</label>
                        <p className="role-display">{user.role}</p>
                    </div>

                    {message && <p className="feedback-message">{message}</p>}

                    <div className="profile-actions">
                        {isEditing ? (
                            <button onClick={handleSave} className="action-button save">
                                <Save size={18} /> Save Changes
                            </button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="action-button edit">
                                <Edit size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
