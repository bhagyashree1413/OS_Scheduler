import { useEffect, useRef, useState } from 'react';
import { compareAlgorithms } from '../api';

function Gantt({ gantt, span, time }) {
  return (
    <div style={{ position: 'relative', height: 56, border: '1px solid rgba(255,255,255,0.04)', background: 'var(--card)', overflow: 'hidden' }}>
      {gantt.map((g, i) => {
        const left = (g.start / Math.max(1, span)) * 100;
        const width = ((g.end - g.start) / Math.max(1, span)) * 100;
        const active = time >= g.start && time < g.end;
        return (
          <div key={i} title={`${g.pid} ${g.start}-${g.end}`} style={{ position: 'absolute', left: `${left}%`, width: `${width}%`, height: 36, top: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'linear-gradient(90deg,#0ea5a4,#06b6d4)' : 'linear-gradient(90deg,var(--accent),var(--accent-2))', color: '#fff', fontSize: 12, opacity: active ? 1 : 0.85 }}>
            {g.pid}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: `${(time / Math.max(1, span)) * 100}%`, top: 0, bottom: 0, width: 2, background: 'crimson' }} />
    </div>
  );
}

export default function Compare() {
  const [processes, setProcesses] = useState([{ pid: 'P1', arrival: 0, burst: 5 }, { pid: 'P2', arrival: 2, burst: 3 }]);
  const [algorithms, setAlgorithms] = useState({ FCFS: true, SJF: true, RR: true });
  const [quantum, setQuantum] = useState(2);
  const [results, setResults] = useState(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(250);
  const timerRef = useRef(null);
  const maxSpan = results ? Math.max(...Object.values(results).flatMap(r => r.gantt.map(g => g.end))) : 0;

  useEffect(() => {
    if (playing && results) {
      timerRef.current = setInterval(() => setTime(t => Math.min(t + 1, maxSpan)), speedMs);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, results, speedMs, maxSpan]);

  function toggleAlg(a) { setAlgorithms(s => ({ ...s, [a]: !s[a] })); }

  async function runCompare() {
    try {
      const procs = processes.map(p => ({ pid: p.pid, arrival: p.arrival === '' ? 0 : Number(p.arrival), burst: p.burst === '' ? 0 : Number(p.burst) }));
      const algs = Object.keys(algorithms).filter(k => algorithms[k]);
      if (algs.length === 0) return alert('Select at least one algorithm');
      const q = quantum === '' ? 0 : Number(quantum);
      const res = await compareAlgorithms({ algorithms: algs, processes: procs, quantum: q });
      setResults(res);
      setTime(0);
      setPlaying(false);
    } catch (e) {
      alert('Invalid input or server error: ' + (e.response?.data?.message || e.message));
    }
  }

  function step(delta = 1) {
    setTime(t => Math.max(0, Math.min(maxSpan, t + delta)));
  }

  return (
    <div>
      <h2>Compare & Timeline</h2>

      <div className="card">
          <div style={{ marginBottom: 8 }}>
          <label>Processes:</label>
          <div style={{ marginTop: 8 }}>
            <div className="process-row process-row-headers" style={{ marginBottom: 6, fontSize: 13, color: 'var(--muted)' }}>
              <div style={{ width: 140 }}>PID</div>
              <div style={{ width: 120 }}>Arrival</div>
              <div style={{ width: 120 }}>Burst</div>
              <div style={{ width: 80 }}></div>
            </div>
            {processes.map((p, i) => (
              <div className="process-row" key={i} style={{ marginBottom: 6 }}>
                <input placeholder="pid" value={p.pid} onChange={e => setProcesses(ps => ps.map((s, idx) => idx === i ? { ...s, pid: e.target.value } : s))} />
                <input placeholder="arrival" type="number" value={p.arrival} onChange={e => setProcesses(ps => ps.map((s, idx) => idx === i ? { ...s, arrival: e.target.value === '' ? '' : Number(e.target.value) } : s))} />
                <input placeholder="burst" type="number" value={p.burst} onChange={e => setProcesses(ps => ps.map((s, idx) => idx === i ? { ...s, burst: e.target.value === '' ? '' : Number(e.target.value) } : s))} />
                <button type="button" className="btn-ghost" onClick={() => setProcesses(ps => ps.filter((_, idx) => idx !== i))}>Remove</button>
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <button type="button" className="btn-outline" onClick={() => setProcesses(ps => [...ps, { pid: `P${ps.length + 1}`, arrival: 0, burst: 1 }])}>Add Process</button>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          {['FCFS','SJF','RR'].map(a => (
            <label key={a} style={{ marginRight: 12 }}>
              <input type="checkbox" checked={algorithms[a]} onChange={() => toggleAlg(a)} /> {a}
            </label>
          ))}
          <label style={{ marginLeft: 12 }}>Quantum <input type="number" value={quantum} onChange={e => setQuantum(e.target.value === '' ? '' : Number(e.target.value))} style={{ width: 80, marginLeft: 8 }} /></label>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn" onClick={runCompare}>Run Compare</button>
          <button className="btn-outline" onClick={() => { setPlaying(p => !p); }}>{playing ? 'Pause' : 'Play'}</button>
          <button className="btn-ghost" onClick={() => step(-1)}>◀ Step</button>
          <button className="btn-ghost" onClick={() => step(1)}>Step ▶</button>
          <button className="btn-ghost" onClick={() => { setTime(0); setPlaying(false); }}>Reset</button>
          <div style={{ marginLeft: 12 }}>
            Speed:
            <select value={speedMs} onChange={e => setSpeedMs(Number(e.target.value))} style={{ marginLeft: 8 }}>
              <option value={50}>50ms</option>
              <option value={100}>100ms</option>
              <option value={200}>200ms</option>
              <option value={250}>250ms</option>
              <option value={500}>500ms</option>
              <option value={1000}>1000ms</option>
            </select>
          </div>
        </div>
      </div>

      {results && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div>Time: <strong>{time}</strong> / {maxSpan}</div>
            <input type="number" min={0} max={maxSpan || 0} value={time} onChange={e => setTime(Math.max(0, Math.min(maxSpan || 0, Number(e.target.value || 0))))} style={{ width: 120, padding: 6, borderRadius: 8 }} />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            {Object.entries(results).map(([alg, r]) => (
              <div key={alg} style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{alg}</strong>
                  <div>Avg Wait: {Number(r.avgWaiting).toFixed(2)} • Avg Turn: {Number(r.avgTurnaround).toFixed(2)}</div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Gantt gantt={r.gantt} span={Math.max(...r.gantt.map(g => g.end))} time={time} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
