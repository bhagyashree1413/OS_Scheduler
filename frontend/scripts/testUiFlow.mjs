const API = process.env.TEST_API_BASE || 'http://localhost:5000';
const FRONTEND = process.env.TEST_FRONTEND_BASE || 'http://localhost:5173';

async function run() {
  try {
    console.log('Checking frontend server...');
    const root = await fetch(FRONTEND + '/');
    if (!root.ok) throw new Error(`Frontend not serving: ${root.status}`);
    console.log('Frontend serving index.html');

    console.log('Logging in via backend...');
    const loginRes = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
    });
    if (!loginRes.ok) throw new Error(`Login failed ${loginRes.status}`);
    const login = await loginRes.json();
    const token = login.token;
    console.log('Login OK, token length:', token?.length || 0);

    console.log('Calling simulate endpoint (mimicking UI)...');
    const payload = { algorithm: 'SJF', processes: [ { pid: 'P1', arrival: 0, burst: 7 }, { pid: 'P2', arrival: 2, burst: 4 }, { pid: 'P3', arrival: 4, burst: 1 } ] };
    const simRes = await fetch(`${API}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (!simRes.ok) throw new Error(`Sim failed ${simRes.status}`);
    const sim = await simRes.json();
    console.log('Sim returned processes:', sim.processes.map(p=>`${p.pid}:${p.start}-${p.end}`).join(', '));

    console.log('UI flow test successful');
  } catch (err) {
    console.error('Test failed:', err.message);
    process.exit(1);
  }
}

run();
