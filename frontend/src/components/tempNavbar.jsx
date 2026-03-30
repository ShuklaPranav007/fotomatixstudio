import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import img from "../assets/logo.png"

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  const navLinks = [
    { id: 'home',    label: 'Home' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav style={{
      padding: '14px 24px',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* LOGO */}
        <div onClick={() => scrollTo('home')} style={{ cursor: 'pointer' }}>
          <img src={img} alt="Foto Matix Studio" style={{ height: '40px', objectFit: 'contain' }} />
        </div>

        {/* DESKTOP LINKS */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {navLinks.map(({ id, label }) => (
            <span key={id} onClick={() => scrollTo(id)} style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
            >
              {label}
            </span>
          ))}
          {isLoggedIn ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => navigate('/admin/dashboard')} className="btn-glass" style={{ padding: '7px 16px', fontSize: '12px' }}>Dashboard</button>
              <button onClick={handleLogout} className="btn-solid" style={{ padding: '7px 16px', fontSize: '12px' }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => navigate('/admin')} className="btn-glass" style={{ padding: '7px 16px', fontSize: '12px' }}>Admin Login</button>
          )}
        </div>

        {/* HAMBURGER */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
          display: 'none', flexDirection: 'column', gap: '4px',
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: '20px', height: '2px', background: '#fff', borderRadius: '2px' }} />
          ))}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{
          marginTop: '12px', paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          {navLinks.map(({ id, label }) => (
            <span key={id} onClick={() => scrollTo(id)} style={{
              fontSize: '14px', color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer', padding: '4px 0',
            }}>
              {label}
            </span>
          ))}
          {isLoggedIn ? (
            <>
              <button onClick={() => { setMenuOpen(false); navigate('/admin/dashboard'); }} className="btn-glass" style={{ padding: '10px', fontSize: '13px', width: '100%' }}>Dashboard</button>
              <button onClick={handleLogout} className="btn-solid" style={{ padding: '10px', fontSize: '13px', width: '100%' }}>Logout</button>
            </>
          ) : (
            <button onClick={() => { setMenuOpen(false); navigate('/admin'); }} className="btn-glass" style={{ padding: '10px', fontSize: '13px', width: '100%' }}>Admin Login</button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}