require('dotenv').config();

const API = process.env.TEST_API_BASE || 'http://localhost:5000';

async function run() {
  try {
    console.log('Logging in test user...');
    const loginRes = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login success, token length:', token?.length ?? 0);

    const payload = {
      algorithm: 'FCFS',
      processes: [
        { pid: 'P1', arrival: 0, burst: 5 },
        { pid: 'P2', arrival: 1, burst: 3 },
        { pid: 'P3', arrival: 2, burst: 8 }
      ]
    };

    console.log('Running simulation...');
    const simRes = await fetch(`${API}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (!simRes.ok) {
      const errBody = await simRes.text();
      throw new Error(`Sim failed: ${simRes.status} ${errBody}`);
    }
    const simData = await simRes.json();
    console.log('Simulation result:', JSON.stringify(simData, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
