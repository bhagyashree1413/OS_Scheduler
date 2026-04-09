import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    if (raw) return JSON.parse(raw);
    // if no stored user but token exists, try to decode role from token
    const t = localStorage.getItem('token');
    if (t) {
      try {
        const payload = JSON.parse(atob(t.split('.')[1]));
        return { id: payload.id, role: payload.role };
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
