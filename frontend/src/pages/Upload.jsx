import { useState } from 'react';
import { CheckCircle2, FileAudio, Loader2, Music, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadTrack } from '../services/api';

export default function Upload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setStatus('Uploading track to cloud storage...');

    try {
      await uploadTrack(file);
      setStatus('Track uploaded successfully! It is now available in the Library.');
      setFile(null);
      if (e.target) e.target.reset();
    } catch (err) {
      setStatus(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('audio/')) {
        setFile(droppedFile);
      } else {
        setStatus('Please select a valid audio file (MP3, WAV, AAC, M4A).');
      }
    }
  };

  if (!user) {
    return (
      <section className="center-page">
        <div className="icon-badge">
          <UploadCloud size={42} />
        </div>
        <h1>Share Your Music</h1>
        <p>You need to be logged in as an Artist to upload tracks to Sonora.</p>
        <Link className="button primary glow-btn" to="/auth">
          Log in or Create Account
        </Link>
      </section>
    );
  }

  if (user.role !== 'artist') {
    return (
      <section className="center-page">
        <div className="icon-badge">
          <Music size={42} />
        </div>
        <h1>Artist Access Only</h1>
        <p>Your account is currently registered as a Music Listener. Create an Artist account to upload audio tracks.</p>
        <Link className="button primary glow-btn" to="/auth">
          Switch to Artist Account
        </Link>
      </section>
    );
  }

  return (
    <section className="upload-container">
      <div className="upload-header">
        <span className="eyebrow">Artist Studio</span>
        <h1>
          Put your sound <br />
          <span className="gradient-text">in the room.</span>
        </h1>
        <p>Share your latest compositions with listeners around the world.</p>
      </div>

      <form className="upload-card" onSubmit={handleSubmit}>
        <label
          className={`dropzone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={e => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {file ? <FileAudio size={44} className="file-icon" /> : <UploadCloud size={44} className="upload-icon" />}
          
          <div className="dropzone-text">
            <strong>{file ? file.name : 'Drag & drop your audio track here'}</strong>
            <span>{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload` : 'Supports MP3, WAV, AAC, M4A'}</span>
          </div>

          <span className="button ghost small file-select-btn">
            {file ? 'Change file' : 'Browse computer'}
          </span>

          <input
            type="file"
            accept="audio/*"
            onChange={e => {
              if (e.target.files?.[0]) setFile(e.target.files[0]);
            }}
          />
        </label>

        {status && (
          <div className={`alert-box ${status.includes('failed') ? 'error' : 'success'}`}>
            <CheckCircle2 size={16} /> {status}
          </div>
        )}

        <button
          type="submit"
          className="button primary full glow-btn"
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className="spin-icon" /> Uploading Track...
            </>
          ) : (
            <>
              <UploadCloud size={16} /> Upload Track Now
            </>
          )}
        </button>
      </form>
    </section>
  );
}
