const express = require('express');
const db = require('./utils/db');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const simRoutes = require('./routes/simulate');
const savedRoutes = require('./routes/simulations');
const compareRoutes = require('./routes/compare');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

app.use('/api/auth', authRoutes);
app.use('/api/simulate', simRoutes);
app.use('/api/simulations', savedRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  const uri = process.env.MONGO_URI;
  try {
    await db.connect(uri);
  } catch (err) {
    console.error('Mongo connection error:', err.message);
    // continue — app can still run without DB for demo purposes
  }

  const server = app.listen(PORT, () => {
    console.log(`Schedulify backend running on port ${PORT}`);
  });

  // graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down...');
    server.close(async () => {
      try { await db.close(); } catch (e) { /* ignore */ }
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start();
