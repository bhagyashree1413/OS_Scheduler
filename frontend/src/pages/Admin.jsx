import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api';
import Footer from '../components/Footer';

async function getUsers() { const res = await api.get('/api/admin/users'); return res.data; }
async function delUser(id) { const res = await api.delete(`/api/admin/users/${id}`); return res.data; }
async function getSims() { const res = await api.get('/api/admin/simulations'); return res.data; }
async function delSim(id) { const res = await api.delete(`/api/admin/simulations/${id}`); return res.data; }

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [sims, setSims] = useState([]);

  useEffect(()=>{ if (!user) return; fetchAll(); }, [user]);
  async function fetchAll(){ try{ setUsers(await getUsers()); setSims(await getSims()); }catch(e){ alert('Failed: '+(e.response?.data?.message||e.message)); } }

  async function exportUsersFmt(fmt){
    try{
      if (fmt === 'csv'){
        const res = await api.get(`/api/admin/users/export?format=csv`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(res.data);
        const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click();
      } else {
        const res = await api.get(`/api/admin/users/export?format=json`);
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'users.json'; a.click();
      }
    }catch(e){ alert('Export failed: '+(e.response?.data?.message||e.message)); }
  }

  async function exportSimsFmt(fmt){
    try{
      if (fmt === 'csv'){
        const res = await api.get(`/api/admin/simulations/export?format=csv`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(res.data);
        const a = document.createElement('a'); a.href = url; a.download = 'simulations.csv'; a.click();
      } else {
        const res = await api.get(`/api/admin/simulations/export?format=json`);
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'simulations.json'; a.click();
      }
    }catch(e){ alert('Export failed: '+(e.response?.data?.message||e.message)); }
  }

  async function handleDeleteUser(id){ if (!confirm('Delete user?')) return; await delUser(id); fetchAll(); }
  async function handleDeleteSim(id){ if (!confirm('Delete simulation?')) return; await delSim(id); fetchAll(); }

  if (!user || user.role !== 'admin') return <div className="card">Admin access required.</div>;

  return (
    <div>
      <h2>Admin</h2>
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Users</h3>
          <div>
            <button className="btn-outline" onClick={()=>exportUsersFmt('csv')} style={{ marginRight: 8 }}>Export CSV</button>
            <button className="btn-ghost" onClick={()=>exportUsersFmt('json')}>Export JSON</button>
          </div>
        </div>
        <table cellPadding={6}><thead><tr><th>Username</th><th>Email</th><th>Role</th><th></th></tr></thead>
          <tbody>
            {users.map(u=> (<tr key={u._id}><td>{u.username}</td><td>{u.email}</td><td>{u.role}</td><td><button className="btn-ghost" onClick={()=>handleDeleteUser(u._id)}>Delete</button></td></tr>))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Saved Simulations</h3>
          <div>
            <button className="btn-outline" onClick={()=>exportSimsFmt('csv')} style={{ marginRight: 8 }}>Export CSV</button>
            <button className="btn-ghost" onClick={()=>exportSimsFmt('json')}>Export JSON</button>
          </div>
        </div>
        <table cellPadding={6}><thead><tr><th>Name</th><th>User</th><th>Algorithm</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {sims.map(s=> (<tr key={s._id}><td>{s.name}</td><td>{s.user?.username || '—'}</td><td>{s.algorithm}</td><td>{new Date(s.createdAt).toLocaleString()}</td><td><button className="btn-ghost" onClick={()=>handleDeleteSim(s._id)}>Delete</button></td></tr>))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
