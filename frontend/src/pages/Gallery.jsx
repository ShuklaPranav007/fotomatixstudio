import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://fotomatixstudio-backend.onrender.com';

// Synced Categories with the rest of your app
const CATEGORIES = ['all', 'wedding', 'prewedding', 'commercial', 'event', 'maternity'];

const CATEGORY_LABELS = {
  all: 'All Work',
  wedding: 'Wedding',
  prewedding: 'Pre Wedding',
  commercial: 'Commercial',
  event: 'Event',
  maternity: 'Maternity',
};

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [active, setActive] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = active === 'all'
      ? `${API}/api/gallery`
      : `${API}/api/gallery?category=${active}`;
      
    axios.get(url)
      .then(res => {
        setMedia(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching gallery:", err);
        setLoading(false);
      });
  }, [active]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg,#0f0f1a 0%,#1a0f2e 40%,#0f1a2e 100%)',
      padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)'
    }}>
      
      {/* Masonry Grid CSS injected directly */}
      <style>{`
        .masonry-grid {
          column-count: 3;
          column-gap: 20px;
        }
        @media (max-width: 1024px) { .masonry-grid { column-count: 2; } }
        @media (max-width: 640px) { .masonry-grid { column-count: 1; } }
        
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 20px;
        }
      `}</style>

      {/* Decorative Blobs */}
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(120,60,255,0.1),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Portfolio</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>Explore our recent captures and stories.</p>
        </div>

        {/* Filter Buttons */}
        <div style={{ 
          display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' 
        }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActive(c)}
              style={{ 
                background: active === c ? 'rgba(124,58,237,0.8)' : 'rgba(255,255,255,0.06)', 
                color: '#fff', 
                padding: '10px 20px', 
                border: active === c ? '1px solid rgba(124,58,237,1)' : '1px solid rgba(255,255,255,0.1)', 
                cursor: 'pointer', 
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}>
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
           <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '40px' }}>Loading gallery...</p>
        ) : media.length === 0 ? (
           <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '40px' }}>No media found in this category.</p>
        ) : (
          <div className="masonry-grid">
            {media.map(item => (
              <div key={item._id} className="card-hover masonry-item" style={{ 
                borderRadius: '16px', 
                overflow: 'hidden', 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative'
              }}>
                {item.type === 'video'
                  ? <video src={item.url} controls style={{ width: '100%', height: 'auto', display: 'block' }} />
                  : <img src={item.url} alt={item.title} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />}
                
                {/* Image Title Overlay */}
                <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.4)', position: 'absolute', bottom: 0, width: '100%', backdropFilter: 'blur(4px)' }}>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title.split('.')[0]} {/* Trims out file extensions like .jpg */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
