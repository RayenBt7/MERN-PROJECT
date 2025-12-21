import { useRef, useEffect } from 'react';
import axios from '../api/axios';
import { FaTimesCircle } from 'react-icons/fa';

export default function VideoPlayerModal({ movie, onClose }) {
  const videoPlayerRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="video-player-modal" onClick={onClose}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        <button className="video-player-close" onClick={onClose}><FaTimesCircle /></button>
        <video
          ref={videoPlayerRef}
          src={movie.videoUrl?.startsWith('http') ? movie.videoUrl : `${axios.defaults.baseURL}/${movie.videoUrl}`}
          controls autoPlay className="video-player"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}