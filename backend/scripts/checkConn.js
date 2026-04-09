const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function check() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connect failed:', err.message || err);
    process.exit(1);
  }
}

check();
