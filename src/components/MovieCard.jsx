import React from "react";

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  return (
    <>
      <div className="movie-card hover:scale-105 duration-300 cursor-pointer hover:shadow-white ">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "no-movie.png"
          }
          alt="movie title"
        />
        <div className="mt-4">
          <h3>{title}</h3>
        </div>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="star" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>•</span>
          <div className="lang">
            {original_language ? original_language : "N/A"}
          </div>
          <span>•</span>
          <div className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieCard;
