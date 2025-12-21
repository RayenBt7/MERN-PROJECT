import { useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import "../styles/home.css";

export default function MovieHero({ movie, onPlayMovie ,small  }) {
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  let hoverTimer = null;

  const handleMouseEnter = () => {
    hoverTimer = setTimeout(() => {
      setShowVideo(true);
      videoRef.current?.play().catch(() => {});
    }, 1200); // Netflix-like delay
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer);
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className={`hero-section ${small ? "hero-small" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hero-background-container">
        <img
          src={
            movie.img?.startsWith("http")
              ? movie.img
              : `http://localhost:5000/${movie.img}`
          }
          alt={movie.title}
          className={`hero-background-image ${showVideo ? "fade-out" : ""}`}
        />

        {movie.videoUrl && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            className={`hero-background-video ${showVideo ? "show" : ""}`}
            src={
              movie.videoUrl.startsWith("http")
                ? movie.videoUrl
                : `http://localhost:5000/${movie.videoUrl}`
            }
          />
        )}
      </div>

      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-description">{movie.desc}</p>

        <button className="hero-btn play" onClick={() => onPlayMovie(movie)}>
          <FaPlay /> Play
        </button>
      </div>
    </div>
  );
}
