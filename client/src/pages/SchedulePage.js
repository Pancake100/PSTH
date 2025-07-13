import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import '../css/SchedulePage.css';

export default function SchedulePage({ user }) {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // State to hold any errors
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchBookings = async () => {
            setError(null); // Reset error on new fetch
            try {
                const response = await fetch(`http://localhost:5001/api/bookings?userId=${user.id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch schedule. Please ensure the server is running.`);
                }
                const data = await response.json();
                setBookings(data);
            } catch (err) {
                console.error("Failed to fetch schedule", err);
                setError(err.message); // Set the error message for the user
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchBookings();
    }, [user]);

    // Render different UI based on the state
    if (isLoading) {
        return <div className="schedule-page-container"><h1>Loading schedule...</h1></div>;
    }

    return (
        <div className="schedule-page-container">
            <div className="page-header">
                <Link to="/dashboard" className="back-button">
                    <ChevronLeft /> Dashboard
                </Link>
                <h1>My Schedule</h1>
            </div>
            <div className="schedule-list">
                {error && <p className="error-message">{error}</p>}
                {!error && bookings.length === 0 && <p>You have no scheduled lessons.</p>}
                {!error && bookings.map(booking => (
                    <div key={booking.id} className="schedule-item">
                        <div>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p>
                                <strong>{user.role === 'teacher' ? 'Student:' : 'Teacher:'}</strong> 
                                {user.role === 'teacher' ? booking.studentName : booking.teacherName}
                            </p>
                        </div>
                        <button onClick={() => navigate(`/lesson/${booking.id}`)}>Go to Lesson</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
