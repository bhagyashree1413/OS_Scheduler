import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Saved() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    if (!user?.id) {
      // redirect to login if not authenticated
      navigate('/login');
      return;
    }
    (async ()=>{
      try {
        const list = await (await import('../api')).listSavedSimulations();
        setItems(list);
      } catch (err) {
        console.error('Failed to load saved simulations', err.message || err);
      }
    })();
  }, [user]);

  async function remove(id) {
    try {
      await (await import('../api')).deleteSavedSimulation(id);
      const filtered = items.filter(i=>i._id!==id && i.id!==id);
      setItems(filtered);
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  }

  function load(item, run) {
    // navigate to simulator with state
    navigate('/simulator', { state: { preset: { algorithm: item.algorithm, quantum: item.quantum, processes: item.processes }, run } });
  }

  return (
    <div className="card">
      <h2>Saved Simulations</h2>
      {!user?.id && <div className="small">You must be logged in to view saved simulations.</div>}
      {items.length===0 && user?.id && <div className="small">No saved simulations yet. Save from the Simulator.</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
        {items.map(it=> (
          <div key={it.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{it.name}</div>
              <div className="small">{it.algorithm}{it.quantum?` • Q=${it.quantum}`:''} • {it.processes?.length || 0} processes • {new Date(it.createdAt).toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-outline" onClick={()=>load(it,false)}>Load</button>
              <button className="btn" onClick={()=>load(it,true)}>Run</button>
              <button className="btn-ghost" onClick={()=>remove(it.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
