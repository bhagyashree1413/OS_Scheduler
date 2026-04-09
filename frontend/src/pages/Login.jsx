import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    try {
      if (isRegister) {
        const data = await apiRegister({ username, email, password });
        login(data);
      } else {
        const data = await apiLogin({ email, password });
        login(data);
      }
      navigate('/simulator');
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-backdrop" />

      <div className="auth-card card" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <h1 className="auth-title">{isRegister ? 'Create your account' : 'Welcome back to Schedulify'}</h1>
          <p className="auth-sub small">Quickly sign in to start running simulations and visualizing results.</p>
        </div>

        <form onSubmit={submit} className="auth-form form-grid" style={{ marginTop: 18 }}>
          {isRegister && (
            <div className="form-row">
              <label>Username</label>
              <input className="auth-input" value={username} onChange={e=>setUsername(e.target.value)} required />
              <div className="helper">This will be visible on your profile.</div>
            </div>
          )}

          <div className="form-row">
            <label>Email</label>
            <input className="auth-input" value={email} onChange={e=>setEmail(e.target.value)} required />
            <div className="helper">Use a work or personal email.</div>
          </div>

          <div className="form-row">
            <label>Password</label>
            <input className="auth-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            <div className="helper">Minimum 8 characters recommended.</div>
          </div>

          {err && <div className="auth-error">{err}</div>}

          <div className="row auth-actions" style={{ marginTop: 6 }}>
            <button className="btn primary" type="submit">{isRegister ? 'Create account' : 'Sign in'}</button>
            <button type="button" onClick={()=>setIsRegister(s=>!s)} className="btn-outline secondary">{isRegister ? 'Have an account? Login' : 'Create account'}</button>
          </div>

          <div className="divider"><span>OR</span></div>

        </form>
      </div>
    </div>
  );
}
