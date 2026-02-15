require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { syncDatabase } = require('./models');
const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/drops', require('./routes/drops'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/purchases', require('./routes/purchases'));

// Start Server
const PORT = process.env.PORT || 4000;

async function startServer() {
  await syncDatabase();

  // Use server.listen instead of app.listen
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
