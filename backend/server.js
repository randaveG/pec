// Importing required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors middleware

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'frontend/dist' directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Database setup using environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render's Postgres
  },
});

/**
 * Handles the registration of a new customer.
 * @param {express.Request} req The request object.
 * @param {express.Response} res The response object.
 */
app.post('/api/register', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO customers(name, email) VALUES($1, $2) RETURNING *',
      [name, email]
    );
    console.log('New customer registered:', result.rows[0]);
    res.status(201).json({ message: 'Customer registered successfully!' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to register customer.' });
  }
});

// Catch-all to serve the React app for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

