import { useEffect, useRef, useState } from 'react';
import { Disc, Music, Pause, Play, Volume2 } from 'lucide-react';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function TrackCard({ track, index = 0 }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(track.uri);
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    const onError = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [track.uri]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(err => {
          console.warn('Playback error:', err.message);
          setPlaying(false);
        });
    }
  };

  const handleSeek = e => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const gradientStyles = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)'
  ];

  return (
    <article className={`track-card ${playing ? 'is-playing' : ''}`}>
      <div
        className="cover-art"
        style={{ background: gradientStyles[index % gradientStyles.length] }}
      >
        <div className={`vinyl-disc ${playing ? 'spinning' : ''}`}>
          <Disc size={40} className="vinyl-icon" />
        </div>
        <div className="cover-badge">
          <Music size={18} />
        </div>
        {playing && (
          <div className="playing-eq-bar">
            <span className="eq-line bar-1" />
            <span className="eq-line bar-2" />
            <span className="eq-line bar-3" />
            <span className="eq-line bar-4" />
          </div>
        )}
      </div>

      <div className="track-info">
        <h3 className="track-title" title={track.title}>{track.title}</h3>
        <p className="track-artist">{track.artist?.name || 'Independent Artist'}</p>
      </div>

      <div className="track-controls">
        <button
          className={`play-btn ${playing ? 'active' : ''}`}
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="play-icon-offset" />}
        </button>

        <div className="track-progress-container">
          <div className="progress-bar-bg" onClick={handleSeek}>
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="progress-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
