import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  const scrollTo = (id) => {
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

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 32px',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky', top: 0, zIndex: 100,
      flexWrap: 'wrap', gap: '12px',
    }}>
      <div onClick={() => scrollTo('home')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
        <img src="/logo.png" alt="Foto Matix Studio" style={{ height: '40px', objectFit: 'contain' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {['home', 'wedding', 'birthday', 'video', 'portrait', 'contact'].map(id => (
          <span key={id} onClick={() => scrollTo(id)} style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.65)',
            cursor: 'pointer', transition: 'color 0.2s', textTransform: 'capitalize',
          }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
          >
            {id === 'home' ? 'Home' : id === 'wedding' ? 'Weddings' : id === 'birthday' ? 'Birthdays' : id === 'video' ? 'Videos' : id === 'portrait' ? 'Portraits' : 'Contact'}
          </span>
        ))}

        {isLoggedIn ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('/admin/dashboard')} className="btn-glass" style={{ padding: '7px 16px', fontSize: '12px' }}>
              Dashboard
            </button>
            <button onClick={handleLogout} className="btn-solid" style={{ padding: '7px 16px', fontSize: '12px' }}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/admin')} className="btn-glass" style={{ padding: '7px 16px', fontSize: '12px' }}>
            Admin Login
          </button>
        )}
      </div>
    </nav>
  );
}