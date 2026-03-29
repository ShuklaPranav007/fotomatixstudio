import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'wedding', type: 'image' });
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/admin');
    fetchMedia();
  }, []);

  const fetchMedia = () =>
    axios.get('http://localhost:5000/api/gallery').then(r => setMedia(r.data));

  const handleUpload = async () => {
    if (!file || !form.title) return alert('Please fill all fields');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', form.title);
    fd.append('category', form.category);
    fd.append('type', form.type);
    await axios.post('http://localhost:5000/api/gallery/upload', fd, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchMedia();
    setForm({ title: '', category: 'wedding', type: 'image' });
    setFile(null);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/gallery/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchMedia();
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>Upload Media</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input placeholder="Title" value={form.title}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          onChange={e => setForm({ ...form, title: e.target.value })} />
        <select value={form.category} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          onChange={e => setForm({ ...form, category: e.target.value })}>
          {['wedding', 'birthday', 'portrait', 'video'].map(c =>
            <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={form.type} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handleUpload}
          style={{ padding: '8px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Upload
        </button>
      </div>

      <h2>Manage Media</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {media.map(item => (
          <div key={item._id} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src={item.url} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.title}</span>
              <button onClick={() => handleDelete(item._id)}
                style={{ background: 'red', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}