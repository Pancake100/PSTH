import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Trash2 } from 'lucide-react';
import '../css/AssignmentsPage.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <p>{message}</p>
            <div className="modal-actions">
                <button onClick={onCancel} className="button-cancel">Cancel</button>
                <button onClick={onConfirm} className="button-confirm">Delete</button>
            </div>
        </div>
    </div>
);

export default function AssignmentsPage({ user }) {
    if (!user) return <div>Loading...</div>;
    return (
        <div className="assignments-page-container">
            <div className="page-header">
                <Link to="/dashboard" className="back-button"><ChevronLeft /> Dashboard</Link>
                <h1 className="section-header">Assignments</h1>
            </div>
            {user.role === 'teacher' ? <TeacherAssignmentsView /> : <StudentAssignmentsView user={user} />}
        </div>
    );
}

const TeacherAssignmentsView = () => {
    const [assignments, setAssignments] = useState([]);
    const [subject, setSubject] = useState('Maths');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [assignmentIdToDelete, setAssignmentIdToDelete] = useState(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/assignments');
                if (!response.ok) throw new Error('Failed to fetch assignments. Is the server running?');
                setAssignments(await response.json());
            } catch (err) {
                setError(err.message);
            }
        };
        fetchAssignments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAssignment = { subject, title, description, dueDate };
        const response = await fetch('http://localhost:5001/api/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAssignment),
        });
        const createdAssignment = await response.json();
        setAssignments([...assignments, createdAssignment]);
        setTitle(''); setDescription(''); setDueDate('');
    };

    const handleDeleteClick = (id) => {
        setAssignmentIdToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        await fetch(`http://localhost:5001/api/assignments/${assignmentIdToDelete}`, { method: 'DELETE' });
        setAssignments(assignments.filter(a => a.id !== assignmentIdToDelete));
        setShowConfirmModal(false);
        setAssignmentIdToDelete(null);
    };

    return (
        <div className="teacher-view">
            {showConfirmModal && <ConfirmationModal message="Are you sure you want to delete this assignment?" onConfirm={confirmDelete} onCancel={() => setShowConfirmModal(false)} />}
            <div className="form-container">
                <h2>Create New Assignment</h2>
                <form onSubmit={handleSubmit}>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                        <option>Maths</option><option>English</option><option>Science</option>
                        <option>Biology</option><option>Chemistry</option><option>History</option>
                    </select>
                    <input type="text" placeholder="Assignment Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    <button type="submit">Add Assignment</button>
                </form>
            </div>
            <div className="log-container">
                <h2>Created Assignments Log</h2>
                {error && <p className="error-message">{error}</p>}
                <div id="log">
                    {assignments.map(a => (
                        <div key={a.id} className="assignment-entry">
                            <div className="assignment-content"><strong>{a.subject}</strong> - {a.title}<span className="due-date">(Due: {a.dueDate || 'N/A'})</span><p>{a.description}</p></div>
                            <button onClick={() => handleDeleteClick(a.id)} className="delete-button"><Trash2 size={18} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StudentAssignmentsView = ({ user }) => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assignRes, subRes] = await Promise.all([
                    fetch('http://localhost:5001/api/assignments'),
                    fetch(`http://localhost:5001/api/submissions/${user.id}`)
                ]);
                if (!assignRes.ok || !subRes.ok) throw new Error('Could not load assignment data. Please ensure the server is running.');
                const assignData = await assignRes.json();
                const subData = await subRes.json();
                setAssignments(assignData);
                setSubmissions(subData);
                setSubjects([...new Set(assignData.map(a => a.subject))]);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    const handleSubmit = async (assignmentId) => {
        await fetch('http://localhost:5001/api/assignments/submit', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignmentId, studentId: user.id }),
        });
        setSubmissions([...submissions, { assignmentId, status: 'submitted' }]);
    };

    const isSubmitted = (assignmentId) => submissions.some(s => s.assignmentId === assignmentId);

    if (isLoading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
    if (error) return <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>;

    return (
        <div className="student-view">
            <div className="subjects-sidebar">
                <h3>Subjects</h3>
                {subjects.map(s => <button key={s} onClick={() => setSelectedSubject(s)} className={`assignments-subject-button ${selectedSubject === s ? 'active' : ''}`}>{s}</button>)}
            </div>
            <div className="assignment-list-container">
                {selectedSubject ? (
                    assignments.filter(a => a.subject === selectedSubject).map(a => (
                        <div key={a.id} className="assignment-item">
                            <div><h3>{a.title}</h3><p>{a.description}</p><span className="due-date">Due: {a.dueDate}</span></div>
                            {isSubmitted(a.id) ? (
                                <div className="submitted-badge"><CheckCircle size={20} /> Submitted</div>
                            ) : (
                                <button onClick={() => handleSubmit(a.id)} className="submit-button">Submit</button>
                            )}
                        </div>
                    ))
                ) : <p className="placeholder-text">Select a subject to view assignments.</p>}
            </div>
        </div>
    );
};
