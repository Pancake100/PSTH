import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App'; // <-- Make sure it's importing App

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* <-- And make sure it's rendering App */}
  </React.StrictMode>
);