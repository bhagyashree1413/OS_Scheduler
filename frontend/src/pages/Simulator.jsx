import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { simulate, createSavedSimulation } from '../api';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ProcessRow({ p, onChange, onRemove }) {
  return (
    <div className="process-row" style={{ marginBottom: 6 }}>
      <input placeholder="pid" value={p.pid} onChange={e=>onChange({...p, pid: e.target.value})} title="Process identifier (e.g. P1)" aria-label="Process ID" />
      <input placeholder="arrival" type="number" value={p.arrival} onChange={e=>onChange({...p, arrival: e.target.value === '' ? '' : Number(e.target.value)})} title="Arrival time (non-negative integer)" aria-label="Arrival time" />
      <input placeholder="burst" type="number" value={p.burst} onChange={e=>onChange({...p, burst: e.target.value === '' ? '' : Number(e.target.value)})} title="Burst time (CPU time required)" aria-label="Burst time" />
      <button type="button" className="btn-ghost" onClick={onRemove}>Remove</button>
    </div>
  );
}

export default function Simulator() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [processes, setProcesses] = useState([{ pid: 'P1', arrival: 0, burst: 5 }]);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [quantum, setQuantum] = useState(2);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);

  const algorithmInfo = {
    FCFS: 'First-Come First-Served: processes are scheduled in order of arrival, non-preemptive. Good for simplicity but can lead to long waits for short jobs.',
    SJF: 'Shortest Job First: chooses the available process with the smallest burst time (non-preemptive). Minimizes average waiting time but requires knowledge of burst lengths.',
    RR: 'Round Robin: preemptive time-sliced scheduling using a fixed quantum. Good for time-sharing systems; shorter quantum increases responsiveness but increases context switching.'
  };

  function updateRow(i, row) {
    setProcesses(ps => ps.map((p, idx)=> idx===i?row:p));
  }
  function removeRow(i) { setProcesses(ps => ps.filter((_,idx)=>idx!==i)); }
  function addRow() { setProcesses(ps => [...ps, { pid: `P${ps.length+1}`, arrival: 0, burst: 1 }]); }

  async function run(e) {
    e.preventDefault();
    setErr(null);
    await submitSimulation();
  }

  async function submitSimulation() {
    setErr(null);
    try {
      // Ensure numeric fields are coerced before sending
      const payload = {
        algorithm,
        processes: processes.map(p => ({ pid: p.pid, arrival: p.arrival === '' ? 0 : Number(p.arrival), burst: p.burst === '' ? 0 : Number(p.burst) })),
        quantum: algorithm==='RR' ? (quantum === '' ? 0 : Number(quantum)) : undefined
      };
      const res = await simulate(payload);
      setResult(res);
      // offer to save result to backend for logged-in users
      if (user?.id) {
        const shouldSave = window.confirm('Save simulation result to your account?');
        if (shouldSave) {
          const name = `Run ${new Date().toLocaleString()}`;
          try {
            await createSavedSimulation({ name, algorithm, quantum, processes, result: res });
            navigate('/saved');
          } catch (err) {
            alert('Failed to save result: ' + (err.response?.data?.message || err.message));
          }
        }
      }
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    }
  }

  const navigate = useNavigate();

  function saveCurrent() {
    if (!user?.id) {
      const ok = window.confirm('You must be logged in to save simulations. Go to Login?');
      if (ok) navigate('/login');
      return;
    }
    const name = window.prompt('Save name (short description):', `Run ${new Date().toLocaleString()}`);
    if (!name) return;
    // call backend API to persist
    (async ()=>{
      try {
        const payload = { name, algorithm, quantum, processes, result };
        await createSavedSimulation(payload);
        navigate('/saved');
      } catch (err) {
        alert('Failed to save: ' + (err.response?.data?.message || err.message));
      }
    })();
  }

  // If navigated here with a preset or auto-run flag, apply it
  useEffect(()=>{
    const st = location.state;
    if (!st) return;
    const { preset, run } = st;
    if (preset) {
      if (preset.algorithm) setAlgorithm(preset.algorithm);
      if (preset.quantum !== undefined) setQuantum(preset.quantum);
      if (Array.isArray(preset.processes)) setProcesses(preset.processes.map(p=>({ pid: p.pid, arrival: Number(p.arrival), burst: Number(p.burst) })));
    }
    if (run) {
      // small delay to allow state updates
      setTimeout(()=>{ submitSimulation(); }, 50);
    }
  }, [location.state]);

  const totalSpan = result?.gantt?.length ? Math.max(...result.gantt.map(g=>g.end)) : 0;

  return (
    <div>
      <div className="row" style={{ marginBottom: 12 }}>
        <div>
          <h2>Simulator</h2>
        </div>
        <div className="right">
          <span className="small">{user?.username}</span>
          <button onClick={logout} className="btn-ghost" style={{ marginLeft: 8 }}>Logout</button>
        </div>
      </div>

      <div className="card">
        <form onSubmit={run} style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'inline-block', marginRight: 8 }}>Algorithm:</label>
            <select value={algorithm} onChange={e=>setAlgorithm(e.target.value)} title={algorithmInfo[algorithm]} aria-label="Scheduling algorithm">
              <option>FCFS</option>
              <option>SJF</option>
              <option>RR</option>
            </select>
            {algorithm==='RR' && (
              <label style={{ marginLeft: 12 }}>Quantum <input type="number" value={quantum} onChange={e=>setQuantum(Number(e.target.value))} style={{ width: 80, marginLeft: 8 }} title="Time quantum in ticks for Round Robin" aria-label="Quantum" /></label>
            )}
          </div>

          <div className="sim-info">
            <div className="sim-info-header">
              <strong>Algorithm:</strong>
              <span className="sim-info-algo">{algorithm}</span>
            </div>
            <div className="sim-info-desc">{algorithmInfo[algorithm]}</div>
            <div className="sim-info-inputs">
              <div><strong>Quantum:</strong> {algorithm==='RR'?quantum:'—'}</div>
              <div className="sim-info-processes">
                <strong>Processes</strong>
                <table cellPadding={4}>
                  <thead><tr><th>PID</th><th>Arrival</th><th>Burst</th></tr></thead>
                  <tbody>
                    {processes.map(p=> (
                      <tr key={p.pid}><td>{p.pid}</td><td>{p.arrival}</td><td>{p.burst}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Processes</strong>
            <div style={{ marginTop: 8 }}>
              {/* header labels for process inputs */}
              <div className="process-row process-row-headers" style={{ marginBottom: 6, fontSize: 13, color: 'var(--muted)' }}>
                <div style={{ width: 140 }}>PID</div>
                <div style={{ width: 120 }}>Arrival</div>
                <div style={{ width: 120 }}>Burst</div>
                <div style={{ width: 80 }}></div>
              </div>
              {processes.map((p,i)=> (
                <ProcessRow key={i} p={p} onChange={r=>updateRow(i,r)} onRemove={()=>removeRow(i)} />
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <button type="button" className="btn-outline" onClick={addRow}>Add Process</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn">Run Simulation</button>
            <button type="button" className="btn-outline" onClick={saveCurrent} title="Save current problem and results">Save</button>
          </div>
        </form>

        {err && <div style={{ color: 'crimson' }}>{err}</div>}

        {result && (
          <div>
            <h3>Results</h3>
            <table cellPadding={6} style={{ borderCollapse: 'collapse' }}>
              <thead><tr><th>PID</th><th>Arrival</th><th>Burst</th><th>Start</th><th>End</th><th>Waiting</th><th>Turnaround</th></tr></thead>
              <tbody>
                {result.processes.map(p=> (
                  <tr key={p.pid}><td>{p.pid}</td><td>{p.arrival}</td><td>{p.burst}</td><td>{p.start ?? '-'}</td><td>{p.end ?? '-'}</td><td>{p.waiting?.toFixed?.(2)||p.waiting}</td><td>{p.turnaround?.toFixed?.(2)||p.turnaround}</td></tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 12 }}>
              <h4>Gantt Chart</h4>
              <div className="gantt">
                {result.gantt.map((g, idx) => {
                  const left = (g.start/Math.max(1,totalSpan))*100;
                  const width = ((g.end - g.start)/Math.max(1,totalSpan))*100;
                  return (
                    <div key={idx} title={`${g.pid} ${g.start}-${g.end}`} className="bar" style={{ left: `${left}%`, width: `${width}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}>
                      {g.pid}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <strong>Average waiting time:</strong> {result.avgWaiting}
              <br />
              <strong>Average turnaround time:</strong> {result.avgTurnaround}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
