import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
// Lazy-load route pages to reduce initial bundle size
const Login = lazy(() => import('./pages/Login'));
const Simulator = lazy(() => import('./pages/Simulator'));
const Home = lazy(() => import('./pages/Home'));
const Saved = lazy(() => import('./pages/Saved'));
const Admin = lazy(() => import('./pages/Admin'));
const Compare = lazy(() => import('./pages/Compare'));
const Profile = lazy(() => import('./pages/Profile'));
const Footer = lazy(() => import('./components/Footer'));
import './App.css';

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  if (!user) return <NavLink to="/login" className={({isActive})=>isActive? 'active' : ''}>Login</NavLink>;

  return (
    <div className="user-area" ref={ref} style={{ position: 'relative' }}>
      <button className="btn-ghost" onClick={() => setOpen(s => !s)}>{user.username || user.name || 'User'}</button>
      {open && (
        <div className="user-menu">
          <button className="user-menu-item" onClick={() => { setOpen(false); navigate('/profile'); }}>Profile</button>
          <button className="user-menu-item" onClick={() => { setOpen(false); navigate('/saved'); }}>Saved</button>
          <button className="user-menu-item" onClick={() => { setOpen(false); navigate('/compare'); }}>Compare</button>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 8 }} />
          <button className="user-menu-item" onClick={() => { setOpen(false); logout(); }}>Logout</button>
        </div>
      )}
    </div>
  );
}

// memoize to avoid unnecessary re-renders when parent updates
const MemoUserMenu = React.memo(UserMenu);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
        <header className="topbar navbar">
          <div className="topbar-inner navbar-inner">
            <div className="brand">
              <div className="logo-mark" />
              <h1>Schedulify</h1>
            </div>
            <nav className="nav-links" role="navigation" aria-label="Main navigation">
              <NavLink to="/" end className={({isActive})=>isActive? 'active' : ''}>Home</NavLink>
              <NavLink to="/simulator" className={({isActive})=>isActive? 'active' : ''}>Simulator</NavLink>
              <AuthContext.Consumer>
                {({ user }) => user && user.role === 'admin' ? (
                  <NavLink to="/admin" className={({isActive})=>isActive? 'active' : ''}>Admin</NavLink>
                ) : null}
              </AuthContext.Consumer>
            </nav>

            <AuthContext.Consumer>
              {({ user, logout }) => (
                <MemoUserMenu user={user} logout={logout} />
              )}
            </AuthContext.Consumer>
          </div>
        </header>

        <div className="app-content">
          <div className="app-container">
          <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
          </Suspense>
          </div>
        </div>
        <Suspense fallback={<div style={{height:48}}/>}><Footer /></Suspense>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
