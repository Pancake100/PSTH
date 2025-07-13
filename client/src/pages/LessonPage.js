import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Send } from 'lucide-react';
import '../css/LessonPage.css';

export default function LessonPage({ user }) {
    const { bookingId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const fetchMessages = async () => {
        const response = await fetch(`http://localhost:5001/api/lessons/${bookingId}/messages`);
        const data = await response.json();
        setMessages(data);
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll for new messages every 5 seconds
        return () => clearInterval(interval);
    }, [bookingId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        await fetch(`http://localhost:5001/api/lessons/${bookingId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, name: user.name, text: newMessage }),
        });
        setNewMessage('');
        fetchMessages(); // Immediately fetch messages after sending
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <Link to="/schedule" className="back-button">
                    <ChevronLeft /> Back to Schedule
                </Link>
                <h1>Lesson Chat</h1>
            </div>
            <div className="chat-container">
                <div className="message-list">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message ${msg.userId === user.id ? 'sent' : 'received'}`}>
                            <strong>{msg.name}</strong>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                </div>
                <form className="message-form" onSubmit={handleSendMessage}>
                    <input 
                        type="text" 
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                    />
                    <button type="submit"><Send /></button>
                </form>
            </div>
        </div>
    );
}
