require('dotenv').config();
const db = require('../src/utils/db');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }

  try {
    await db.connect(uri);
    const existing = await User.findOne({ email: 'test@example.com' });
    if (existing) {
      console.log('Test user already exists:', existing.email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    const user = new User({ username: 'testuser', email: 'test@example.com', password: hash });
    await user.save();
    console.log('Created test user: test@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err.message);
    process.exit(1);
  }
}

run();
