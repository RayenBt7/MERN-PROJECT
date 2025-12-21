import { useRef } from "react";
import { FaPlay } from "react-icons/fa";
import "../styles/movies.css";

export default function MovieCard({ movie, onPlayMovie }) {
  const videoRef = useRef(null);

  const imageUrl = movie.img?.startsWith("http")
    ? movie.img
    : `http://localhost:5000/${movie.img}`;

  const videoUrl = movie.videoUrl?.startsWith("http")
    ? movie.videoUrl
    : `http://localhost:5000/${movie.videoUrl}`;

  return (
    <div
      className="movie-card"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
      onClick={() => onPlayMovie(movie)}
    >
      <img src={imageUrl} alt={movie.title} className="card-background" />

      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          className="card-background card-video"
        />
      )}

      <div className="card-overlay">
        <h4 className="card-title">{movie.title}</h4>
        <button
          className="card-play-button"
          onClick={(e) => {
            e.stopPropagation();
            onPlayMovie(movie);
          }}
        >
          <FaPlay />
        </button>
      </div>
    </div>
  );
}
