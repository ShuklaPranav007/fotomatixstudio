import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'wedding', type: 'image' });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
    fetchMedia();
  }, []);

  const fetchMedia = () =>
    axios.get(`${API}/api/gallery`).then(r => setMedia(r.data));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file || !form.title) return setMessage('Please fill title and select a file');
    setUploading(true);
    setMessage('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('type', form.type);
      await axios.post(`${API}/api/gallery/upload`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Uploaded successfully!');
      setFile(null);
      setPreview(null);
      setForm({ title: '', category: 'wedding', type: 'image' });
      fetchMedia();
    } catch {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await axios.delete(`${API}/api/gallery/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMedia();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const inputStyle = {
    padding: '9px 12px', fontSize: '13px',
    border: '0.5px solid #ddd', borderRadius: '8px',
    outline: 'none', background: '#fff', color: '#111',
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600 }}>Studio Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>Manage your portfolio</p>
        </div>
        <button onClick={handleLogout} style={{
          fontSize: '12px', padding: '7px 16px',
          border: '0.5px solid #ddd', borderRadius: '8px',
          background: 'transparent', color: '#555',
        }}>
          Logout
        </button>
      </div>

      {/* Upload Card */}
      <div style={{
        border: '0.5px solid #e5e5e5', borderRadius: '16px',
        padding: '28px', marginBottom: '36px', background: '#fff',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '20px' }}>Upload new work</h2>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input
            placeholder="Title (e.g. Sharma Wedding)"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ ...inputStyle, flex: '1', minWidth: '180px' }}
          />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
            {['wedding', 'birthday', 'portrait', 'video'].map(c =>
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            )}
          </select>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <input type="file" id="file-input" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
            <label htmlFor="file-input" style={{
              display: 'inline-block', padding: '9px 18px', fontSize: '13px',
              border: '0.5px solid #ddd', borderRadius: '8px', cursor: 'pointer',
              background: '#f9f9f9', color: '#333',
            }}>
              {file ? file.name : 'Choose file'}
            </label>
          </div>

          {preview && (
            <img src={preview} alt="preview" style={{
              width: '64px', height: '64px', objectFit: 'cover',
              borderRadius: '8px', border: '0.5px solid #e5e5e5',
            }} />
          )}

          <button onClick={handleUpload} disabled={uploading} style={{
            padding: '9px 22px', fontSize: '13px', fontWeight: 500,
            background: '#111', color: '#fff', border: 'none', borderRadius: '8px',
            opacity: uploading ? 0.6 : 1,
          }}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {message && (
          <p style={{
            marginTop: '14px', fontSize: '13px',
            color: message.includes('success') ? '#27ae60' : '#e74c3c',
          }}>
            {message}
          </p>
        )}
      </div>

      {/* Media Grid */}
      <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px' }}>
        All work <span style={{ color: '#aaa', fontWeight: 400 }}>({media.length})</span>
      </h2>

      {media.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: '14px', padding: '40px 0', textAlign: 'center' }}>
          No uploads yet. Add your first photo above.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '12px',
        }}>
          {media.map(item => (
            <div key={item._id} style={{
              borderRadius: '12px', overflow: 'hidden',
              border: '0.5px solid #e5e5e5', background: '#f9f9f9',
            }}>
              {item.type === 'video' ? (
                <video src={item.url} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
              ) : (
                <img src={item.url} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
              )}
              <div style={{
                padding: '10px 12px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#111' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: '#888', textTransform: 'capitalize', marginTop: '2px' }}>{item.category}</div>
                </div>
                <button onClick={() => handleDelete(item._id)} style={{
                  fontSize: '11px', padding: '5px 10px',
                  background: '#fff0f0', color: '#c0392b',
                  border: '0.5px solid #ffd5d5', borderRadius: '6px',
                }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
