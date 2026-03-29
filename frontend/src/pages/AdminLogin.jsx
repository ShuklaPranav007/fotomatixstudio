import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/admin/dashboard');
  }, []);

  const handleLogin = async () => {
    if (!form.username || !form.password) return setError('Please fill all fields');
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#0f0f1a 0%,#1a0f2e 40%,#0f1a2e 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(120,60,255,0.2),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(60,180,255,0.15),transparent 70%)', pointerEvents: 'none' }} />

      <div className="fade-up" style={{
        width: '100%', maxWidth: '400px',
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '24px', padding: '40px',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/logo.png" alt="Foto Matix Studio" style={{ height: '50px', objectFit: 'contain', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Admin Login</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Foto Matix Studio dashboard</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: '10px', padding: '10px 14px',
            fontSize: '13px', color: '#fca5a5', marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>Email</label>
          <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
            placeholder="your@email.com"
            style={{
              width: '100%', padding: '12px 14px', fontSize: '13px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px', outline: 'none', color: '#fff', boxSizing: 'border-box',
            }} />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            style={{
              width: '100%', padding: '12px 14px', fontSize: '13px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px', outline: 'none', color: '#fff', boxSizing: 'border-box',
            }} />
        </div>

        <button onClick={handleLogin} disabled={loading} className="btn-solid" style={{ width: '100%', padding: '13px', fontSize: '14px', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}