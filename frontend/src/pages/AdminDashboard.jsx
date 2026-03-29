import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 12px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '13px', fontWeight: active ? 500 : 400,
    background: active ? '#f0f0f0' : 'transparent',
    color: active ? '#111' : '#666',
  }}>
    <span style={{ fontSize: '16px' }}>{icon}</span>
    {label}
  </div>
);

export default function AdminDashboard() {
  const [tab, setTab] = useState('gallery');
  const [media, setMedia] = useState([]);
  const [sections, setSections] = useState([]);
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
    fetchSections();
  }, []);

  const fetchMedia = () => axios.get(`${API}/api/gallery`).then(r => setMedia(r.data));
  const fetchSections = () => axios.get(`${API}/api/sections`).then(r => setSections(r.data));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file || !form.title) return setMessage('Please fill title and select a file');
    setUploading(true); setMessage('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('type', form.type);
      await axios.post(`${API}/api/gallery/upload`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✓ Uploaded successfully!');
      setFile(null); setPreview(null);
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
    await axios.delete(`${API}/api/gallery/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchMedia();
  };

  const toggleSection = async (section) => {
    const updated = await axios.put(`${API}/api/sections/${section._id}`,
      { visible: !section.visible },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSections(prev => prev.map(s => s._id === section._id ? updated.data : s));
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/admin'); };

  const inputStyle = { padding: '9px 12px', fontSize: '13px', border: '0.5px solid #e5e5e5', borderRadius: '8px', outline: 'none', background: '#fff', color: '#111', boxSizing: 'border-box' };

  const totalPhotos = media.filter(m => m.type === 'image').length;
  const totalVideos = media.filter(m => m.type === 'video').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9f9f9', fontFamily: 'inherit' }}>

      {/* SIDEBAR */}
      <div style={{ width: '220px', background: '#fff', borderRight: '0.5px solid #e5e5e5', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ fontSize: '15px', fontWeight: 600, padding: '0 8px 20px', borderBottom: '0.5px solid #e5e5e5', marginBottom: '12px' }}>
          Shubham Studio
          <div style={{ fontSize: '11px', fontWeight: 400, color: '#888', marginTop: '2px' }}>Admin Panel</div>
        </div>

        <NavItem icon="🖼" label="Gallery" active={tab === 'gallery'} onClick={() => setTab('gallery')} />
        <NavItem icon="📋" label="Sections" active={tab === 'sections'} onClick={() => setTab('sections')} />

        <div style={{ marginTop: 'auto' }}>
          <NavItem icon="↩" label="View Site" active={false} onClick={() => navigate('/')} />
          <NavItem icon="🚪" label="Logout" active={false} onClick={handleLogout} />
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

        {/* Topbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 600 }}>Dashboard</h1>
            <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Manage your portfolio content</p>
          </div>
          <button onClick={handleLogout} style={{ fontSize: '12px', padding: '7px 16px', border: '0.5px solid #ddd', borderRadius: '8px', background: 'transparent', color: '#555', cursor: 'pointer' }}>
            Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total photos', num: totalPhotos },
            { label: 'Videos', num: totalVideos },
            { label: 'Sections', num: sections.length },
            { label: 'Categories', num: 4 },
          ].map((s, i) => (
            <div key={i} style={{ background: '#f0f0f0', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 600 }}>{s.num}</div>
            </div>
          ))}
        </div>

        {/* GALLERY TAB */}
        {tab === 'gallery' && (
          <>
            {/* Upload Card */}
            <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px' }}>Upload new work</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <input placeholder="Title (e.g. Sharma Wedding)" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  style={{ ...inputStyle, flex: '1', minWidth: '160px' }} />
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                  {['wedding', 'birthday', 'portrait', 'video'].map(c =>
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="file" id="file-input" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <label htmlFor="file-input" style={{ padding: '9px 16px', fontSize: '13px', border: '0.5px solid #e5e5e5', borderRadius: '8px', cursor: 'pointer', background: '#f9f9f9', color: '#333' }}>
                  {file ? file.name : 'Choose file'}
                </label>
                {preview && <img src={preview} alt="preview" style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: '0.5px solid #e5e5e5' }} />}
                <button onClick={handleUpload} disabled={uploading} style={{ padding: '9px 22px', fontSize: '13px', fontWeight: 500, background: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: uploading ? 0.6 : 1 }}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {message && <p style={{ marginTop: '12px', fontSize: '13px', color: message.includes('✓') ? '#27ae60' : '#e74c3c' }}>{message}</p>}
            </div>

            {/* Media Grid */}
            <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '14px', padding: '22px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px' }}>
                All work <span style={{ fontWeight: 400, color: '#aaa', fontSize: '13px' }}>({media.length})</span>
              </h2>
              {media.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>No uploads yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '10px' }}>
                  {media.map(item => (
                    <div key={item._id} style={{ borderRadius: '10px', overflow: 'hidden', border: '0.5px solid #e5e5e5', background: '#f9f9f9' }}>
                      {item.type === 'video'
                        ? <video src={item.url} style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
                        : <img src={item.url} alt={item.title} style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />}
                      <div style={{ padding: '8px 10px', borderTop: '0.5px solid #e5e5e5' }}>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: '#111', marginBottom: '2px' }}>{item.title}</div>
                        <div style={{ fontSize: '11px', color: '#888', textTransform: 'capitalize', marginBottom: '8px' }}>{item.category}</div>
                        <button onClick={() => handleDelete(item._id)} style={{ width: '100%', padding: '5px', fontSize: '11px', borderRadius: '6px', border: '0.5px solid #ffd5d5', background: '#fff0f0', color: '#c0392b', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* SECTIONS TAB */}
        {tab === 'sections' && (
          <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '14px', padding: '22px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>Manage sections</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Toggle sections visible or hidden on the public site</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sections.map(section => (
                <div key={section._id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', border: '0.5px solid #e5e5e5', borderRadius: '10px',
                  background: section.visible ? '#fff' : '#f9f9f9',
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: section.visible ? '#111' : '#aaa' }}>{section.name}</div>
                    <div style={{ fontSize: '12px', color: section.visible ? '#27ae60' : '#aaa', marginTop: '2px' }}>
                      {section.visible ? 'Visible on site' : 'Hidden from site'}
                    </div>
                  </div>
                  <button onClick={() => toggleSection(section)} style={{
                    padding: '7px 18px', fontSize: '12px', fontWeight: 500,
                    borderRadius: '8px', cursor: 'pointer',
                    border: section.visible ? '0.5px solid #e5e5e5' : 'none',
                    background: section.visible ? '#fff' : '#111',
                    color: section.visible ? '#555' : '#fff',
                  }}>
                    {section.visible ? 'Hide' : 'Show'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
