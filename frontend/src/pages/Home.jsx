import { ArrowUpRight, Disc, Music, Sparkles, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import Library from './Library';

export default function Home() {
  return (
    <div className="home-page">
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <Sparkles size={14} /> Next Generation Audio Platform
          </p>
          <h1>
            Discover sounds <br />
            <span className="gradient-text">you'll replay forever.</span>
          </h1>
          <p className="hero-text">
            Unfiltered independent music, curated for passionate listeners and creator-driven audio communities.
          </p>
          <div className="hero-actions">
            <Link className="button primary large glow-btn" to="/library">
              Explore Library <ArrowUpRight size={18} />
            </Link>
            <Link className="button ghost large" to="/upload">
              <UploadCloud size={18} /> Upload Your Music
            </Link>
          </div>
        </div>

        <div className="hero-art">
          <div className="vinyl-container">
            <div className="vinyl spinning">
              <Disc size={180} className="vinyl-grooves" />
              <div className="vinyl-label">
                <Music size={24} />
              </div>
            </div>
          </div>
          <div className="floating-card now-playing-badge">
            <span className="pulse-indicator" />
            <div>
              <small>Now Streaming</small>
              <strong>Sonora Originals</strong>
            </div>
            <div className="mini-eq">
              <span className="eq-bar bar-1" />
              <span className="eq-bar bar-2" />
              <span className="eq-bar bar-3" />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-banner section-shell">
        <div className="stat-card">
          <strong>100%</strong>
          <span>Independent Artists</span>
        </div>
        <div className="stat-card">
          <strong>HD</strong>
          <span>High Fidelity Audio</span>
        </div>
        <div className="stat-card">
          <strong>24/7</strong>
          <span>Instant Streaming</span>
        </div>
      </section>

      <section className="home-library section-shell">
        <SectionHeading
          eyebrow="Featured Tracks"
          title="Fresh From The Studio"
          action={
            <Link className="button ghost small" to="/library">
              View All Tracks <ArrowUpRight size={14} />
            </Link>
          }
        />
        <Library embedded />
      </section>

      <section className="artist-cta-panel section-shell">
        <div className="artist-cta-copy">
          <span className="eyebrow">For Creators & Producers</span>
          <h2>Put your music in front of the world.</h2>
          <p>
            Upload your master files, build albums, and connect directly with thousands of listeners.
          </p>
          <Link className="button primary large glow-btn" to="/upload">
            Start Uploading <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="animated-waveform">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} style={{ animationDelay: `${(i % 5) * 0.15}s` }} />
          ))}
        </div>
      </section>
    </div>
  );
}
