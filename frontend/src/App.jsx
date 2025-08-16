import React, { useState } from 'react';
import './App.css';

// A simple form component for customer registration.
function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // The base URL for the backend API.
  // IMPORTANT: Change this to your deployed Render backend URL.
  const API_URL = 'https://your-backend-app.onrender.com/api/register'; 

  /**
   * Handles the form submission.
   * Sends a POST request to the backend with the user's name and email.
   * @param {Event} e The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Basic validation to ensure fields are not empty.
    if (!name || !email) {
      setMessage('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      // Check if the response was successful.
      if (response.ok) {
        setMessage('Registration successful!');
        // Clear the form fields after successful submission.
        setName('');
        setEmail('');
      } else {
        const errorData = await response.json();
        setMessage(`Registration failed: ${errorData.error}`);
      }
    } catch (error) {
      setMessage('An error occurred. Please check your network connection.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Customer Registration 📝</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Register
          </button>
        </form>
        {message && (
          <p className="mt-6 text-center text-sm font-medium text-gray-600 bg-gray-100 p-3 rounded-md">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;


