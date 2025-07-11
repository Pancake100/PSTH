import React from 'react';

const subjects = ['Maths', 'English', 'Science', 'Biology', 'Chemistry', 'History'];

const LibraryPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl">
        {subjects.map((subject) => (
          <button
            key={subject}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:bg-blue-100 transition duration-200 text-lg font-semibold py-4"
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
