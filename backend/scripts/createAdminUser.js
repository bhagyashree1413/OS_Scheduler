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
    const email = 'admin@gmail.com';
    let user = await User.findOne({ email });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin', salt);
    if (user) {
      user.username = 'admin';
      user.password = hash;
      user.role = 'admin';
      await user.save();
      console.log('Updated existing user to admin:', email);
    } else {
      user = new User({ username: 'admin', email, password: hash, role: 'admin' });
      await user.save();
      console.log('Created admin user:', email, '/ password: admin');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error creating/updating admin user:', err.message);
    process.exit(1);
  }
}

run();
