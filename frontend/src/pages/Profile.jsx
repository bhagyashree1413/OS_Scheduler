import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 680, width: '100%', padding: 24, textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Profile</h2>
        <p style={{ color: 'var(--muted)', marginTop: 10 }}>Please log in to view your profile.</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 680, width: '100%', padding: 28, borderRadius: 14, background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', boxShadow: '0 12px 36px rgba(2,6,23,0.55)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Profile</h2>
            <div style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: 6 }}>Account information</div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ color: 'var(--muted)', fontWeight: 700 }}>Username</div>
            <div style={{ color: 'var(--text)', fontWeight: 800, textAlign: 'right' }}>{user.username || user.name || user.id}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ color: 'var(--muted)', fontWeight: 700 }}>Email</div>
            <div style={{ color: 'var(--text)', fontWeight: 700, textAlign: 'right' }}>{user.email || '—'}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ color: 'var(--muted)', fontWeight: 700 }}>Role</div>
            <div style={{ color: 'var(--text)', fontWeight: 700, textAlign: 'right', textTransform: 'capitalize' }}>{user.role || 'user'}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn" onClick={logout} style={{ padding: '10px 16px', borderRadius: 10 }}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
