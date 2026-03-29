import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <div style={{ width: '100%', maxWidth: '380px', border: '0.5px solid #e5e5e5', borderRadius: '16px', padding: '36px', background: '#fff' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Admin Login</h2>
          <p style={{ fontSize: '13px', color: '#888' }}>Shubham Studio dashboard</p>
        </div>

        {error && (
          <div style={{ background: '#fff0f0', border: '0.5px solid #ffd5d5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#c0392b', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Email</label>
          <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
            placeholder="your@email.com"
            style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: '0.5px solid #ddd', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: '0.5px solid #ddd', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', padding: '11px', fontSize: '14px', fontWeight: 500,
          background: '#111', color: '#fff', border: 'none', borderRadius: '8px',
          cursor: 'pointer', opacity: loading ? 0.6 : 1,
        }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}