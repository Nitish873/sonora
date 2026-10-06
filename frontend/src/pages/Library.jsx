import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import TrackCard from '../components/TrackCard';
import SectionHeading from '../components/SectionHeading';
import { getTracks } from '../services/api';

export default function Library({ embedded = false }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTracks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTracks();
      setTracks(res.musics || []);
    } catch (e) {
      console.error('Failed to load tracks:', e.message);
      setError(e.message || 'Could not load tracks from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracks();
  }, []);

  return (
    <section className={embedded ? 'library-embedded' : 'library-container section-shell'}>
      {!embedded && (
        <SectionHeading
          eyebrow="Curated Sound Library"
          title="Fresh from Independent Studios"
          action={
            <button className="button ghost small icon-btn" onClick={loadTracks} disabled={loading}>
              <RefreshCw size={15} className={loading ? 'spin-icon' : ''} /> Refresh Tracks
            </button>
          }
        />
      )}

      {loading ? (
        <div className="empty-state">
          <Loader2 size={32} className="spin-icon text-indigo" />
          <p>Loading music library...</p>
        </div>
      ) : error ? (
        <div className="empty-state error-state">
          <p>{error}</p>
          <button className="button primary small glow-btn" onClick={loadTracks}>
            Try Again
          </button>
        </div>
      ) : tracks.length ? (
        <div className="track-grid">
          {tracks.map((track, i) => (
            <TrackCard key={track._id || i} track={track} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Sparkles size={32} className="text-indigo" />
          <p>No tracks uploaded yet — be the first artist to publish a song.</p>
        </div>
      )}
    </section>
  );
}
