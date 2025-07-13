import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import '../css/LibraryPage.css';

export default function LibraryPage() {
    const [libraryData, setLibraryData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        const fetchLibraryData = async () => {
            setError(null);
            try {
                const response = await fetch('http://localhost:5001/api/library');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setLibraryData(data);
            } catch (error) {
                console.error("Failed to fetch library data:", error);
                setError("Could not load library data. Please ensure the server is running and accessible.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLibraryData();
    }, []);

    // View #3: Show the content of a selected book
    if (selectedBook) {
        return (
            <div className="library-page-container">
                <button onClick={() => setSelectedBook(null)} className="back-button">
                    <ChevronLeft /> Back to Book List
                </button>
                <div className="content-container">
                    <h1>{selectedBook.name}</h1>
                    <p className="book-author">by {selectedBook.author} ({selectedBook.year})</p>
                    <div className="book-content">
                        <p>{selectedBook.content}</p>
                    </div>
                </div>
            </div>
        );
    }

    // View #2: Show the list of books for a selected subject
    if (selectedSubject) {
        const books = libraryData[selectedSubject] || [];
        return (
            <div className="library-page-container">
                <button onClick={() => setSelectedSubject(null)} className="back-button">
                    <ChevronLeft /> Back to Subjects
                </button>
                <div className="content-container">
                    <h1>{selectedSubject}</h1>
                    <ul className="book-list">
                        {books.length > 0 ? (
                            books.map(book => (
                                <li key={book.name} onClick={() => setSelectedBook(book)} className="book-item">
                                    <strong>{book.name}</strong> by {book.author} ({book.year})
                                </li>
                            ))
                        ) : (
                            <p>No books found for this subject.</p>
                        )}
                    </ul>
                </div>
            </div>
        );
    }

    // View #1 (Default): Show the grid of subjects
    return (
        <div className="library-page-container">
            <div className="page-header">
                <Link to="/dashboard" className="back-button">
                    <ChevronLeft /> Dashboard
                </Link>
                <h1>Library</h1>
            </div>

            {isLoading && <p style={{ textAlign: 'center' }}>Loading subjects...</p>}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && (
                <div className="subjects-grid">
                    {Object.keys(libraryData).length > 0 ? (
                        Object.keys(libraryData).map((subject) => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className="library-subject-button"
                            >
                                {subject}
                            </button>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center' }}>No subjects found in the library.</p>
                    )}
                </div>
            )}
        </div>
    );
}
