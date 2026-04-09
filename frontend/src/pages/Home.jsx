import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const PRESETS = [
  { name: 'Short Jobs', algorithm: 'SJF', processes: [ { pid: 'P1', arrival: 0, burst: 2 }, { pid: 'P2', arrival: 1, burst: 1 }, { pid: 'P3', arrival: 2, burst: 3 } ] },
  { name: 'Mixed Workload', algorithm: 'FCFS', processes: [ { pid: 'P1', arrival: 0, burst: 5 }, { pid: 'P2', arrival: 1, burst: 3 }, { pid: 'P3', arrival: 2, burst: 8 } ] },
  { name: 'RR Demo', algorithm: 'RR', quantum: 2, processes: [ { pid: 'P1', arrival: 0, burst: 6 }, { pid: 'P2', arrival: 1, burst: 4 }, { pid: 'P3', arrival: 2, burst: 3 } ] }
];

export default function Home(){
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  function openSimulator(preset, run){
    navigate('/simulator', { state: { preset, run } });
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="card" style={{ padding: 18, background: 'linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.01))' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>

          <div style={{ flex: '1 1 420px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ maxWidth: 680 }}>
              <h1 style={{ margin: 0, fontSize: '1.6rem', letterSpacing: '0.2px' }}>Schedulify</h1>
              <h3 style={{ marginTop: 6, marginBottom: 0, color: 'var(--muted)', fontWeight: 600, fontSize: '0.98rem' }}>Scheduling Simulator</h3>
              <p className="small" style={{ marginTop: 12, color: 'var(--muted)', maxWidth: 640 }}>Visualize CPU scheduling algorithms (FCFS, SJF, RR). Try presets or run a quick demo to see behavior and metrics.</p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn" onClick={()=>openSimulator(null,false)} style={{ padding: '10px 16px', borderRadius: 10, transition: 'transform 160ms ease, box-shadow 200ms ease' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>Open Simulator</button>
              <button className="btn-outline" onClick={()=>openSimulator(PRESETS[1], true)} style={{ padding: '10px 16px', borderRadius: 10 }}>Run Quick Demo</button>
            </div>
          </div>

          <div style={{ width: '360px', flex: '0 0 360px', minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>Presets</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PRESETS.map((p,i)=> {
                const isHover = hovered === i;
                const cardStyle = {
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 12,
                  background: isHover ? 'linear-gradient(180deg, rgba(59,130,246,0.04), rgba(59,130,246,0.02))' : 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))',
                  boxShadow: isHover ? '0 14px 30px rgba(2,6,23,0.45)' : '0 8px 20px rgba(2,6,23,0.36)',
                  transform: isHover ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'all 220ms cubic-bezier(.2,.8,.2,1)'
                };

                return (
                  <div key={i} className="card" style={cardStyle} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontWeight: 800 }}>{p.name}</div>
                      <div className="small" style={{ color: 'var(--muted)' }}>Algorithm: {p.algorithm}{p.quantum?` • Quantum ${p.quantum}`:''} • {p.processes.length} processes</div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-outline" onClick={()=>openSimulator(p,false)} style={{ borderRadius: 10, padding: '8px 12px' }}>Load</button>
                      <button className="btn" onClick={()=>openSimulator(p,true)} style={{ borderRadius: 10, padding: '8px 12px' }}>Run</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <div style={{ marginTop: 20, display: 'grid', gap: 18 }}>

        <section style={{ display: 'grid', gap: 12 }} aria-label="Features">
          <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div className="card" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start', borderRadius: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>A</div>
              <div>
                <div style={{ fontWeight: 800 }}>Multiple Algorithms</div>
                <div className="small" style={{ color: 'var(--muted)' }}>FCFS, SJF, RR supported for comparison and learning.</div>
              </div>
            </div>

            <div className="card" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start', borderRadius: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>G</div>
              <div>
                <div style={{ fontWeight: 800 }}>Gantt Visualization</div>
                <div className="small" style={{ color: 'var(--muted)' }}>Clear timeline view of scheduling and execution order.</div>
              </div>
            </div>

            <div className="card" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start', borderRadius: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>M</div>
              <div>
                <div style={{ fontWeight: 800 }}>Performance Metrics</div>
                <div className="small" style={{ color: 'var(--muted)' }}>See waiting & turnaround times to evaluate strategies.</div>
              </div>
            </div>

            <div className="card" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start', borderRadius: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>I</div>
              <div>
                <div style={{ fontWeight: 800 }}>Interactive Simulation</div>
                <div className="small" style={{ color: 'var(--muted)' }}>Step through runs or play continuously to observe behavior.</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }} aria-label="How it works">
          <h2 style={{ margin: 0, fontSize: '1.15rem' }}>How it works</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div className="card" style={{ flex: '1 1 180px', padding: 12, borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>1</div>
              <div>
                <div style={{ fontWeight: 800 }}>Select algorithm</div>
                <div className="small" style={{ color: 'var(--muted)' }}>Choose FCFS, SJF, or RR.</div>
              </div>
            </div>

            <div className="card" style={{ flex: '1 1 180px', padding: 12, borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>2</div>
              <div>
                <div style={{ fontWeight: 800 }}>Enter processes</div>
                <div className="small" style={{ color: 'var(--muted)' }}>Add arrival and burst times.</div>
              </div>
            </div>

            <div className="card" style={{ flex: '1 1 180px', padding: 12, borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>3</div>
              <div>
                <div style={{ fontWeight: 800 }}>Visualize results</div>
                <div className="small" style={{ color: 'var(--muted)' }}>Watch the Gantt chart and metrics update.</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'stretch' }} aria-label="Highlights">
          <div className="card" style={{ padding: 12, borderRadius: 12, flex: '1 1 180px', textAlign: 'center' }}>
            <div style={{ fontWeight: 800 }}>Supported algorithms</div>
            <div className="small" style={{ color: 'var(--muted)', marginTop: 6 }}>FCFS • SJF • RR</div>
          </div>

          <div className="card" style={{ padding: 12, borderRadius: 12, flex: '1 1 180px', textAlign: 'center' }}>
            <div style={{ fontWeight: 800 }}>Real-time simulation</div>
            <div className="small" style={{ color: 'var(--muted)', marginTop: 6 }}>Play, pause, or step through runs.</div>
          </div>

          <div className="card" style={{ padding: 12, borderRadius: 12, flex: '1 1 180px', textAlign: 'center' }}>
            <div style={{ fontWeight: 800 }}>Easy interface</div>
            <div className="small" style={{ color: 'var(--muted)', marginTop: 6 }}>Minimal controls for quick learning.</div>
          </div>
        </section>

        <section style={{ marginTop: 6, padding: 18, borderRadius: 12, background: 'linear-gradient(180deg, rgba(59,130,246,0.03), rgba(59,130,246,0.01))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }} aria-label="Call to action">
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>Start Simulating Now</div>
            <div className="small" style={{ color: 'var(--muted)', marginTop: 6 }}>Jump into the simulator and explore different strategies.</div>
          </div>
          <div>
            <button className="btn" onClick={()=>openSimulator(null,false)} style={{ padding: '10px 18px', borderRadius: 10 }}>Open Simulator</button>
          </div>
        </section>

      </div>
    </div>
  );
}
