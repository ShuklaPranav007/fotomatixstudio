import { useEffect, useState } from 'react';
import axios from 'axios';

// 1. Added the API connection variable
const API = import.meta.env.VITE_API_URL || 'https://fotomatixstudio-backend.onrender.com';

const CATEGORIES = ['all', 'wedding', 'birthday', 'portrait', 'video'];

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [active, setActive] = useState('all');

  useEffect(() => {
    // 2. Replaced localhost with the API variable
    const url = active === 'all'
      ? `${API}/api/gallery`
      : `${API}/api/gallery?category=${active}`;
      
    axios.get(url).then(res => setMedia(res.data));
  }, [active]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActive(c)}
            style={{ 
              background: active === c ? '#000' : '#eee', 
              color: active === c ? '#fff' : '#000', 
              padding: '8px 16px', 
              border: 'none', 
              cursor: 'pointer', 
              borderRadius: '4px' 
            }}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {media.map(item => (
          <div key={item._id} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {item.type === 'video'
              ? <video src={item.url} controls style={{ width: '100%' }} />
              : <img src={item.url} alt={item.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />}
            <p style={{ padding: '8px', margin: 0 }}>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}