import React from "react";
import MovieCard from "./MovieCard";
import "../styles/movies.css";

const MovieRow = React.forwardRef(({ title, movies, onPlayMovie, id }, ref) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="movie-row" ref={ref} id={id}>
      <h2 className="movie-row-title">{title}</h2>
      <div className="movie-row-container">
        {movies.map((movie) => (
          <MovieCard 
            key={movie._id} 
            movie={movie} 
            onPlayMovie={onPlayMovie} 
          />
        ))}
      </div>
    </div>
  );
});

export default MovieRow;
