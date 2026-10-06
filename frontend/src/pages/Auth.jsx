import { useState } from 'react';
import { ArrowLeft, Loader2, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', identity: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const { signIn, busy } = useAuth();
  const navigate = useNavigate();

  const isSignup = mode === 'signup';

  const updateField = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleMode = () => {
    setError('');
    setMode(isSignup ? 'login' : 'signup');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      if (isSignup) {
        if (!form.name || !form.identity || !form.password) {
          setError('Please fill in all required fields.');
          return;
        }
        await signIn(
          {
            name: form.name,
            email: form.identity,
            password: form.password,
            role: form.role || 'user'
          },
          'signup'
        );
      } else {
        if (!form.identity || !form.password) {
          setError('Please provide your name or email and password.');
          return;
        }
        await signIn(
          {
            identity: form.identity,
            password: form.password
          },
          'login'
        );
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-hero">
        <span className="eyebrow">{isSignup ? 'Join Sonora Community' : 'Welcome Back'}</span>
        <h1 className="auth-title">
          {isSignup ? (
            <>
              Make space for <br />
              <span className="gradient-text">extraordinary sound.</span>
            </>
          ) : (
            <>
              Your music library <br />
              <span className="gradient-text">is waiting.</span>
            </>
          )}
        </h1>
        <p className="auth-description">
          Stream independent tracks, discover fresh artists, and upload your own creations.
        </p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-card-header">
          <h2>{isSignup ? 'Create Account' : 'Log In'}</h2>
          <p>{isSignup ? 'Get started in seconds' : 'Enter your details below'}</p>
        </div>

        {error && <div className="alert-box error">{error}</div>}

        {isSignup && (
          <div className="form-group">
            <label htmlFor="name">Display Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={updateField}
              placeholder="e.g. Maya Lin"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="identity">{isSignup ? 'Email Address' : 'Name or Email'}</label>
          <input
            id="identity"
            name="identity"
            type={isSignup ? 'email' : 'text'}
            required
            value={form.identity}
            onChange={updateField}
            placeholder={isSignup ? 'you@example.com' : 'Enter email or name'}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={updateField}
            placeholder="••••••••"
          />
        </div>

        {isSignup && (
          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select id="role" name="role" value={form.role} onChange={updateField}>
              <option value="user">Music Listener</option>
              <option value="artist">Music Artist (Can Upload Tracks)</option>
            </select>
          </div>
        )}

        <button type="submit" className="button primary full glow-btn" disabled={busy}>
          {busy ? (
            <>
              <Loader2 size={16} className="spin-icon" /> Connecting...
            </>
          ) : isSignup ? (
            <>
              <UserPlus size={16} /> Create Account
            </>
          ) : (
            <>
              <LogIn size={16} /> Log In
            </>
          )}
        </button>

        <div className="auth-footer">
          <span>{isSignup ? 'Already have an account?' : 'Need an account?'}</span>
          <button type="button" className="text-link-btn" onClick={toggleMode}>
            {isSignup ? 'Log in instead' : 'Create an account'}
          </button>
        </div>

        <Link className="back-home-link" to="/">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </form>
    </section>
  );
}
