import React, { useState } from "react";
import {motion,AnimatePresence, easeInOut} from "framer-motion"
const MovieCard = ({
  movie: {
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
    overview,
  },
}) => {
  let [showDescription, setShowDescription] = useState(false);
  return (
    <>
      <div
        className="movie-card  hover:scale-105 relative duration-300 cursor-pointer hover:shadow-white "
        onClick={() => setShowDescription(!showDescription)}
      >
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "no-movie.png"
          }
          alt="movie title"
          className={`duration-200 ease ${
            showDescription ? "opacity-10" : "opacity-100"
          }`}
        />

        <AnimatePresence>

          {showDescription && (
          <motion.div
          initial={{
            y:-40,
            opacity:0
          }}
          animate={{
            y:10,
            opacity:1
          }}
          exit={{
            y:-40,
            opacity:0
          }}
          transition={{
            duration:0.4,
            ease:easeInOut
          }}
            className={`desc absolute pr-3 md:pr-1 top-10  flex justify-center items-center flex-col gap-2`}
          >
            <h3 className="bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,0,255,0.7)] ">
              {title}
            </h3>

            <p className="text-white ">{overview}</p>
          </motion.div>
        )}
        </AnimatePresence>
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
