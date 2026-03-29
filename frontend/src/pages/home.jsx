import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CATEGORIES = ['all', 'wedding', 'portrait', 'birthday', 'video'];

export default function Home() {
  const [media, setMedia] = useState([]);
  const [sections, setSections] = useState([]);
  const [active, setActive] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/sections`).then(r => setSections(r.data));
  }, []);

  useEffect(() => {
    const url = active === 'all'
      ? `${API}/api/gallery`
      : `${API}/api/gallery?category=${active}`;
    setLoading(true);
    axios.get(url).then(r => setMedia(r.data)).finally(() => setLoading(false));
  }, [active]);

  const isVisible = (name) => {
    const s = sections.find(s => s.name.toLowerCase() === name.toLowerCase());
    return s ? s.visible : true;
  };

  return (
    <div>

      {/* HERO */}
      {isVisible('hero') && (
        <section style={{
          padding: '80px 32px 56px', textAlign: 'center',
          borderBottom: '0.5px solid #e5e5e5',
        }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>
            Based in Indore, MP
          </p>
          <h1 style={{ fontSize: '38px', fontWeight: 600, lineHeight: 1.2, marginBottom: '14px' }}>
            Capturing moments<br />that last forever
          </h1>
          <p style={{ fontSize: '15px', color: '#555', maxWidth: '460px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Wedding photography, cinematic videos, portraits and events. Every frame tells your story.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => document.getElementById('work').scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '11px 24px', fontSize: '13px', fontWeight: 500, background: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              View Gallery
            </button>
            <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '11px 24px', fontSize: '13px', background: 'transparent', color: '#111', border: '0.5px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>
              Book a Session
            </button>
          </div>
        </section>
      )}

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '0.5px solid #e5e5e5' }}>
        {[
          { num: '320+', label: 'Weddings' },
          { num: '8 yrs', label: 'Experience' },
          { num: '1200+', label: 'Happy clients' },
          { num: '4K', label: 'Cinematic video' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '22px 16px', textAlign: 'center',
            borderRight: i < 3 ? '0.5px solid #e5e5e5' : 'none',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 600 }}>{s.num}</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* GALLERY */}
      {isVisible('gallery') && (
        <section id="work">
          <div style={{ display: 'flex', gap: '8px', padding: '20px 32px', borderBottom: '0.5px solid #e5e5e5', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                fontSize: '12px', padding: '6px 16px', borderRadius: '99px',
                border: '0.5px solid', cursor: 'pointer',
                borderColor: active === cat ? '#111' : '#ddd',
                background: active === cat ? '#111' : 'transparent',
                color: active === cat ? '#fff' : '#555',
                transition: 'all 0.15s',
              }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ padding: '24px 32px 56px' }}>
            {loading ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '40px 0', fontSize: '14px' }}>Loading...</p>
            ) : media.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '60px 0', fontSize: '14px' }}>No photos yet in this category.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '12px' }}>
                {media.map(item => (
                  <div key={item._id} style={{
                    borderRadius: '12px', overflow: 'hidden',
                    border: '0.5px solid #e5e5e5', position: 'relative',
                    background: '#f5f5f5', cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.querySelector('.ov').style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.querySelector('.ov').style.opacity = 0}
                  >
                    {item.type === 'video'
                      ? <video src={item.url} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
                      : <img src={item.url} alt={item.title} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
                    }
                    <div className="ov" style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)',
                      display: 'flex', alignItems: 'flex-end', padding: '14px',
                      opacity: 0, transition: 'opacity 0.2s', borderRadius: '12px',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{item.title}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '2px', textTransform: 'capitalize' }}>{item.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {isVisible('about') && (
        <section id="about" style={{
          padding: '56px 32px', borderTop: '0.5px solid #e5e5e5',
          display: 'flex', gap: '48px', alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: '#f0f0f0', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '36px', flexShrink: 0,
          }}>📷</div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '10px' }}>Shubham — Photographer & Filmmaker</h2>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, maxWidth: '560px' }}>
              With 8+ years of experience capturing weddings, portraits and events across Madhya Pradesh,
              I bring a cinematic eye and a personal touch to every shoot.
            </p>
          </div>
        </section>
      )}

      {/* CONTACT */}
      {isVisible('contact') && (
        <section id="contact" style={{
          padding: '36px 32px', background: '#f9f9f9',
          borderTop: '0.5px solid #e5e5e5',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '20px',
        }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '6px' }}>Ready to book your session?</p>
            <p style={{ fontSize: '13px', color: '#666' }}>+91 98765 43210 &nbsp;·&nbsp; shubhamstudio@gmail.com</p>
          </div>
          <a href="mailto:shubhamstudio@gmail.com">
            <button style={{ padding: '11px 24px', fontSize: '13px', fontWeight: 500, background: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Get in touch
            </button>
          </a>
        </section>
      )}

    </div>
  );
}