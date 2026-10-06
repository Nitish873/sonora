import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Music2, Sparkles, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const exit = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="app-container">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span className="brand-text">sonora</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
            Home
          </NavLink>
          <NavLink to="/library" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Music2 size={16} /> Library
          </NavLink>
          <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>
            <UploadCloud size={16} /> For Artists
          </NavLink>
        </nav>
        <div className="account-actions">
          {user ? (
            <div className="user-badge">
              <span className="welcome">Hi, <strong>{user.name}</strong> ({user.role})</span>
              <button className="button ghost small" onClick={exit}>
                <LogOut size={15} /> Log out
              </button>
            </div>
          ) : (
            <Link className="button primary small glow-btn" to="/auth">
              <LogIn size={15} /> Log in / Join
            </Link>
          )}
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <Link className="brand" to="/">
            <span className="brand-mark"><Sparkles size={16} /></span> sonora
          </Link>
          <p className="footer-tagline">Crafted for curious ears & independent music creators.</p>
        </div>
      </footer>
    </div>
  );
}
