// server.js
// This script sets up a Node.js Express server to handle customer registration
// and store the data in a PostgreSQL database.

// Import required modules
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001; // Use environment port for Render deployment

// Middleware
// Enable CORS for all routes to allow the React frontend to make requests
app.use(cors());
// Parse incoming JSON payloads from the frontend
app.use(express.json());

// Set up the PostgreSQL connection pool
// This uses the DATABASE_URL environment variable provided by Render.
// The `ssl: { rejectUnauthorized: false }` is necessary for Render's
// database connection to work correctly.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Initializes the database by creating the customers table if it doesn't exist.
 * This ensures the table is ready to receive data when the server starts.
 */
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database table "customers" is ready.');
  } catch (err) {
    console.error('Error creating database table:', err.stack);
  }
}

// Register a new customer
app.post('/api/register', async (req, res) => {
  const { name, email } = req.body;

  // Basic server-side validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    // SQL query to insert a new customer into the table.
    // The `RETURNING *` clause returns the newly inserted row,
    // including the generated `id` and `registered_at` timestamp.
    const result = await pool.query(
      'INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );

    // Send the created customer data back to the frontend.
    res.status(201).json({ 
      message: 'Customer registered successfully',
      customer: result.rows[0] 
    });
  } catch (err) {
    console.error('Error during customer registration:', err.stack);
    // Check for a unique constraint violation (duplicate email)
    if (err.code === '23505') {
        return res.status(409).json({ error: 'This email is already registered.' });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server after the database is initialized.
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(err => {
    console.error('Failed to start server due to database initialization error:', err.stack);
});
