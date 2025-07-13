import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import '../css/BookingPage.css';

export default function BookingPage({ user }) {
    return (
        <div className="booking-page-container">
            <div className="page-header">
                <Link to="/dashboard" className="back-button">
                    <ChevronLeft /> Dashboard
                </Link>
                <h1>Booking</h1>
            </div>
            {user.role === 'teacher' ? <TeacherBookingView user={user} /> : <StudentBookingView user={user} />}
        </div>
    );
}

const TeacherBookingView = ({ user }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:5001/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacherId: user.id, teacherName: user.name, date, time }),
            });
            if (!response.ok) throw new Error('Failed to add slot.');
            setDate(''); setTime('');
            setMessage('Availability added successfully!');
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            setMessage('Error: Could not add slot.');
        }
    };

    return (
        <div className="form-container">
            <h2>Set Your Availability</h2>
            <form onSubmit={handleSubmit}>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
                <button type="submit">Add Slot</button>
            </form>
            {message && <p className="feedback-message">{message}</p>}
        </div>
    );
};

const StudentBookingView = ({ user }) => {
    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSlots = async () => {
            const response = await fetch('http://localhost:5001/api/availability');
            const data = await response.json();
            setSlots(data);
        };
        fetchSlots();
    }, []);

    const handleBook = async (availabilityId) => {
        setMessage('');
        try {
            const response = await fetch('http://localhost:5001/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ availabilityId, studentId: user.id, studentName: user.name }),
            });
            if (!response.ok) throw new Error('Failed to book lesson.');
            // Remove the booked slot from the list to update the UI
            setSlots(slots.filter(s => s.id !== availabilityId));
            setMessage('Lesson booked successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error: Could not book lesson.');
        }
    };

    return (
        <div className="slots-container">
            <h2>Available Lessons</h2>
            {message && <p className="feedback-message">{message}</p>}
            {slots.length > 0 ? slots.map(slot => (
                <div key={slot.id} className="slot-item">
                    <div>
                        <p><strong>Teacher:</strong> {slot.teacherName}</p>
                        <p><strong>Date:</strong> {slot.date}</p>
                        <p><strong>Time:</strong> {slot.time}</p>
                    </div>
                    <button onClick={() => handleBook(slot.id)}>Book Now</button>
                </div>
            )) : <p>No available lessons at the moment.</p>}
        </div>
    );
};
