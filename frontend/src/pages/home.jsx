import { useEffect, useState } from 'react';
import axios from 'axios';
import img from "../assets/logo.png"

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CATEGORIES = ['wedding', 'prewedding', 'commercial', 'event', 'maternity'];

const categoryConfig = {
  wedding:    { label: 'Wedding Shoot',          desc: 'Capturing the love, joy, and unforgettable moments of your special day.' },
  prewedding: { label: 'Pre Wedding Shoot',      desc: 'Beautiful pre-wedding stories told through stunning frames.' },
  commercial: { label: 'Commercial Shoot',       desc: 'Professional commercial photography for your brand and business.' },
  event:      { label: 'Event Shoot',            desc: 'Every event deserves to be remembered — we make sure it is.' },
  maternity:  { label: 'Maternity Photoshoot',   desc: 'Celebrating the beautiful journey of motherhood, frame by frame.' },
};

const Blob = ({ style }) => (
  <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', ...style }} />
);

export default function Home() {
  const [mediaByCategory, setMediaByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          CATEGORIES.map(cat =>
            axios.get(`${API}/api/gallery?category=${cat}`).then(r => ({ cat, data: r.data }))
          )
        );
        const grouped = {};
        results.forEach(({ cat, data }) => { grouped[cat] = data; });
        setMediaByCategory(grouped);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f0f1a 0%,#1a0f2e 40%,#0f1a2e 100%)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      <Blob style={{ top: '-120px', left: '-120px', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(120,60,255,0.18),transparent 70%)' }} />
      <Blob style={{ top: '300px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(60,180,255,0.13),transparent 70%)' }} />
      <Blob style={{ bottom: '200px', left: '30%', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(80,200,120,0.09),transparent 70%)' }} />

      {/* HERO */}
      <section id="home" style={{ padding: '90px 32px 70px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div className="fade-up">
          
          <img src={img} alt="Foto Matix Studio" style={{ height: '70px', objectFit: 'contain', marginBottom: '20px', display: 'block', margin: '0 auto 20px' }} />
          <h1 style={{ fontSize: '54px', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '18px', letterSpacing: '-0.02em' }}>
            Capturing moments<br />
            <span style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              that last forever
            </span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '460px', margin: '0 auto 24px', lineHeight: 1.8 }}>
            Wedding, pre-wedding, commercial, events and maternity photography. Every frame tells your story.
          </p>
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: '36px' }}>
            <a href="tel:+918960889997" style={{ color: '#a78bfa' }}>+91 89608 89997</a>
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn-solid" onClick={() => document.getElementById('wedding')?.scrollIntoView({ behavior: 'smooth' })}>
              View Gallery
            </button>
            <button className="btn-glass" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Book a Session
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', padding: '0 32px 64px', position: 'relative', zIndex: 2 }}>
        {[
          { num: '100+', label: 'Weddings & Events' },
          { num: '2+ years', label: 'Experience' },
          { num: '200+', label: 'Happy clients' },
          { num: '4K', label: 'Cinematic video' },
        ].map((s, i) => (
          <div key={i} className="card-hover" style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '22px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{s.num}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CATEGORY SECTIONS */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Loading...</p>
      ) : (
        CATEGORIES.map((cat) => {
          const items = mediaByCategory[cat] || [];
          const config = categoryConfig[cat];
          if (items.length === 0) return null;

          return (
            <section key={cat} id={cat} style={{ padding: '48px 32px', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                <div style={{ width: '4px', height: '32px', background: 'linear-gradient(to bottom,#7c3aed,#2563eb)', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{config.label}</h2>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>{items.length} items</span>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px', marginLeft: '20px', lineHeight: 1.7 }}>
                {config.desc}
              </p>
              <div style={{ height: '1px', background: 'linear-gradient(to right,rgba(124,58,237,0.5),rgba(37,99,235,0.3),transparent)', marginBottom: '28px' }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '16px' }}>
                {items.map(item => (
                  <div key={item._id} className="card-hover" style={{
                    borderRadius: '16px', overflow: 'hidden',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                  }}>
                    {item.type === 'video'
                      ? <video src={item.url} controls style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} />
                      : <img src={item.url} alt={cat} style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} loading="lazy" />
                    }
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top,rgba(0,0,0,0.7),transparent)',
                      padding: '20px 14px 12px',
                    }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{config.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}

      {/* CONTACT */}
      <section id="contact" style={{ padding: '48px 32px 64px', position: 'relative', zIndex: 2 }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px', padding: '48px 40px',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
        }}>
          <img src={img} alt="Foto Matix Studio" style={{ height: '56px', objectFit: 'contain', marginBottom: '20px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Let's Talk!</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px', lineHeight: 1.8 }}>
            An open invitation to connect and explore collaborative opportunities.
          </p>

          {/* ADDRESS */}
          <div style={{
            display: 'inline-flex', alignItems: 'flex-start', gap: '8px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '12px', padding: '12px 20px',
            margin: '16px auto 32px', maxWidth: '420px',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: '2px', flexShrink: 0 }}>
              <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.49-2.01-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(167,139,250,0.8)"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                Kamla Nagar Colony, Raebareli Road<br />
                Ayodhya — 224001
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+918960889997">
              <button className="btn-solid">+91 89608 89997</button>
            </a>
            <a href="mailto:fotomatixstudio99@gmail.com">
              <button className="btn-glass">fotomatixstudio99@gmail.com</button>
            </a>
          </div>

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '40px' }}>
            © 2025 Foto Matix Studio. All rights reserved.
          </p>
        </div>
      </section>

    </div>
  );
}