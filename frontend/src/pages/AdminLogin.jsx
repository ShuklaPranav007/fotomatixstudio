import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h2>Admin Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Username" style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
        onChange={e => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
        onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleLogin}
        style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Login
      </button>
    </div>
  );
}