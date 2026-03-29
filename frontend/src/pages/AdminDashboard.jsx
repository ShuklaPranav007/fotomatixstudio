import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CATEGORIES = ['wedding', 'prewedding', 'commercial', 'event', 'maternity'];

const CATEGORY_LABELS = {
  wedding:    'Wedding Shoot',
  prewedding: 'Pre Wedding Shoot',
  commercial: 'Commercial Shoot',
  event:      'Event Shoot',
  maternity:  'Maternity Photoshoot',
};

export default function AdminDashboard() {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ category: 'wedding', type: 'image' });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
    fetchMedia();
  }, []);

  const fetchMedia = () => axios.get(`${API}/api/gallery`).then(r => setMedia(r.data));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return setMessage('Please select a file');
    setUploading(true); setMessage('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', file.name);
      fd.append('category', form.category);
      fd.append('type', form.type);
      await axios.post(`${API}/api/gallery/upload`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✓ Uploaded successfully!');
      setFile(null); setPreview(null);
      setForm({ category: 'wedding', type: 'image' });
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

  const filtered = activeTab === 'all' ? media : media.filter(m => m.category === activeTab);

  const inputStyle = {
    padding: '10px 14px', fontSize: '13px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', outline: 'none',
    color: '#fff', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0f1a 0%,#1a0f2e 40%,#0f1a2e 100%)', position: 'relative' }}>

      <style>{`
        .media-grid { grid-template-columns: repeat(5, minmax(0,1fr)); }
        .media-thumb { height: 90px; }
        @media (max-width: 1024px) {
          .media-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
          .media-thumb { height: 110px; }
        }
        @media (max-width: 768px) {
          .media-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
          .media-thumb { height: 130px; }
        }
        @media (max-width: 480px) {
          .media-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .media-thumb { height: 150px; }
        }
      `}</style>

      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(120,60,255,0.15),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(60,180,255,0.1),transparent 70%)', pointerEvents: 'none' }} />

      {/* TOPBAR
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 32px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="logo" style={{ height: '36px', objectFit: 'contain' }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginLeft: '4px' }}>Admin Dashboard</span>
        </div>
        <button onClick={() => navigate('/')} className="btn-glass" style={{ padding: '7px 18px', fontSize: '12px' }}>
          View Site
        </button>
      </div> */}

      {/* CONTENT */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 2 }}>

        {/* Stats / Filter Tabs
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: '10px', marginBottom: '28px' }}>
          {[
            { label: 'All', num: media.length, cat: 'all' },
            ...CATEGORIES.map(cat => ({
              label: CATEGORY_LABELS[cat],
              num: media.filter(m => m.category === cat).length,
              cat,
            })),
          ].map((s, i) => (
            <div key={i} onClick={() => setActiveTab(s.cat)} style={{
              background: activeTab === s.cat ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)',
              border: activeTab === s.cat ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px', padding: '14px 10px',
              cursor: 'pointer', transition: 'all 0.2s',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '6px', lineHeight: 1.3 }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{s.num}</div>
            </div>
          ))}
        </div> */}

        {/* Upload Card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '24px', marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '18px' }}>Upload new work</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              {CATEGORIES.map(c =>
                <option key={c} value={c} style={{ background: '#1a0f2e' }}>
                  {CATEGORY_LABELS[c]}
                </option>
              )}
            </select>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
              <option value="image" style={{ background: '#1a0f2e' }}>Image</option>
              <option value="video" style={{ background: '#1a0f2e' }}>Video</option>
            </select>
            <input type="file" id="file-input" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
            <label htmlFor="file-input" style={{
              padding: '10px 16px', fontSize: '13px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
            }}>
              {file ? file.name : 'Choose file'}
            </label>
            {preview && <img src={preview} alt="preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }} />}
            <button onClick={handleUpload} disabled={uploading} className="btn-solid" style={{ opacity: uploading ? 0.6 : 1 }}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {message && <p style={{ marginTop: '12px', fontSize: '13px', color: message.includes('✓') ? '#34d399' : '#f87171' }}>{message}</p>}
        </div>

        {/* Media Grid by Category */}
        {activeTab === 'all' ? (
          CATEGORIES.map(cat => {
            const items = media.filter(m => m.category === cat);
            if (items.length === 0) return null;
            return <CategorySection key={cat} cat={cat} items={items} onDelete={handleDelete} />;
          })
        ) : (
          <CategorySection cat={activeTab} items={filtered} onDelete={handleDelete} />
        )}

      </div>
    </div>
  );
}

function CategorySection({ cat, items, onDelete }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', padding: '22px', marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '3px', height: '24px', background: 'linear-gradient(to bottom,#7c3aed,#2563eb)', borderRadius: '2px' }} />
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
          {{ wedding: 'Wedding Shoot', prewedding: 'Pre Wedding Shoot', commercial: 'Commercial Shoot', event: 'Event Shoot', maternity: 'Maternity Photoshoot' }[cat]}
        </h3>
        <span style={{ fontSize: '11px', padding: '2px 10px', background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '50px', color: 'rgba(200,180,255,0.8)' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="media-grid" style={{ display: 'grid', gap: '10px' }}>
        {items.map(item => (
          <div key={item._id} style={{
            borderRadius: '12px', overflow: 'hidden',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {item.type === 'video'
              ? <video src={item.url} className="media-thumb" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
              : <img src={item.url} alt="media" className="media-thumb" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
            }
            <div style={{ padding: '8px' }}>
              <button onClick={() => onDelete(item._id)} style={{
                width: '100%', padding: '5px', fontSize: '11px',
                borderRadius: '6px',
                background: 'rgba(220,38,38,0.15)',
                border: '1px solid rgba(220,38,38,0.3)',
                color: '#fca5a5', cursor: 'pointer',
              }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}