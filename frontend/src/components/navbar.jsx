import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 32px',
      borderBottom: '0.5px solid #e5e5e5',
      background: '#fff',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '0.04em' }}>
        Shubham Studio
        <span style={{ fontSize: '12px', fontWeight: 400, color: '#888', marginLeft: '8px' }}>
          Photography & Film
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <span onClick={() => scrollTo('work')} style={{ fontSize: '13px', color: '#555', cursor: 'pointer' }}>Work</span>
        <span onClick={() => scrollTo('about')} style={{ fontSize: '13px', color: '#555', cursor: 'pointer' }}>About</span>
        <span onClick={() => scrollTo('contact')} style={{ fontSize: '13px', color: '#555', cursor: 'pointer' }}>Contact</span>
        <button onClick={() => navigate('/admin')} style={{
          fontSize: '12px', padding: '7px 16px',
          border: '0.5px solid #ccc', borderRadius: '8px',
          background: 'transparent', color: '#111',
        }}>
          Admin Login
        </button>
      </div>
    </nav>
  );
}