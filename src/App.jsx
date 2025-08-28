import { useState, useEffect, useRef } from "react";
import { useDebounce } from "react-use";
import "./index.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  let [searchTerm, setSearchTerm] = useState("");
  let [movieList, setMovieList] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [errorMessage, setErrorMessage] = useState("");
  let [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  let [trendingMovies, setTrendingMovies] = useState([]);
  let [page, setPage] = useState(1);

  const popularRef = useRef(null);
  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      let endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
      let response = await fetch(endPoint, API_OPTIONS);
      if (!response.ok) {
        setErrorMessage("failed to fetch movies");
      }

      let data = await response.json();

      if (data.Response === false) {
        setErrorMessage(data.Error || "failed to fetch movies");
        setMovieList([]);
        return;
      }
      console.log(data.results[0]);
      setMovieList(data.results);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      setErrorMessage(`ERROR Fetching Movies : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      let movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      setErrorMessage(`FAILED IN FETCHING TRENDING MOVIES:${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
    if (popularRef.current) {
      popularRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [debounceSearchTerm, page]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);
 
  return (
    <>
      <main>
        <div className="pattern" />
        <div className="wrapper">
          {!searchTerm && (
            <header>
              <img src="hero.png" className="max-w-xl" alt="" />
              <h1>
                Find <span className="text-gradient">Movies</span> you'll Love
                Without the Hassle
              </h1>
            </header>
          )}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {trendingMovies.length > 0 && searchTerm === "" && (
            <section className="trending">
              <h2>Trending</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt="movie poster" />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="all-movies mt-6 " ref={popularRef}>
            <div className="popular">
              <h2 className="mt-4 mb-6" id="popular">
               <button onClick={()=>setPage(1)} className="cursor-pointer"> Popular</button>
              </h2>
              {isLoading ? (
                <Spinner />
              ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
              ) : (
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
              )}
            </div>
          </section>
          <div className="nextPage flex justify-center gap-5 items-center mt-4">
            {page == 1 ? (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="text-white hover:text-gray-400 duration-200 font-semibold cursor-pointer"
              >
                NEXT
              </button>
            ) : (
              <>
                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  className="text-white hover:text-gray-400 duration-200 font-semibold cursor-pointer"
                >
                  BACK
                </button>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="text-white hover:text-gray-400 duration-200 font-semibold cursor-pointer"
                >
                  NEXT
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
