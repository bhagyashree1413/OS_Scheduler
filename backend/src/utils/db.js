const mongoose = require('mongoose');

async function connect(uri, opts = {}) {
  if (!uri) {
    console.warn('No MONGO_URI provided; skipping DB connection.');
    return null;
  }

  // sensible defaults; Atlas supports TLS and SRV
  const defaultOpts = {
    // Mongoose 7 defaults are usually fine; keep these for clarity
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    // limit socket pool for moderate concurrency; can be tuned in production
    maxPoolSize: opts.maxPoolSize || 10,
    ...opts,
  };

  // simple retry/backoff
  const maxAttempts = 5;
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      attempt += 1;
      await mongoose.connect(uri, defaultOpts);
      console.log('MongoDB connected');
      // optional: enable debug in dev
      if (process.env.NODE_ENV === 'development') mongoose.set('debug', true);
      return mongoose.connection;
    } catch (err) {
      console.error(`MongoDB connect attempt ${attempt} failed:`, err.message);
      if (attempt >= maxAttempts) throw err;
      const backoff = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(r => setTimeout(r, backoff));
    }
  }
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
