require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { syncDatabase } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============ ROUTES ============

// ============ START SERVER ============
const PORT = process.env.PORT || 4000;
async function startServer() {
  // Sync database (create tables)
  await syncDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
