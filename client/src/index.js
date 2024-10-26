// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // import the App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // render the App component inside the 'root' div
);
