import React from 'react'
import { useState,useEffect } from 'react'
import './App.css'
import Search from './components/search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'
const Api= 'https://api.themoviedb.org/3'
const url = 'https://api.themoviedb.org/3/discover/movie?&language=en-US&sort_by=popularity.desc';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MWJmZmE0ZjExOWJlMWUzM2FlZTRiZGMwYWNjNzVhZSIsIm5iZiI6MTc1MTY5ODM0MC40MDYwMDAxLCJzdWIiOiI2ODY4Y2JhNDU1MDRmNmNkOTBlZDRmNDMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.xpu8veWhiOFMDh10lqr9mWqlo8gHieJnIDIrxljV-r0'
  }
};
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendMovies, setTrendMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebounceSearchTerm] = useState("");

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${Api}/search/movie?query=${encodeURIComponent(query)}`
        : `${Api}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, options);
      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();
      if (data.response === "False") {
        setErrorMessage(data.Error || "Failed to Fetch Movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching Movies", error);
      setErrorMessage("Error fetching Movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
  try {
    const movies = await getTrendingMovies(); // ✅ Now uses Appwrite
    setTrendMovies(movies);
  } catch (error) {
    console.error("Error loading trending movies", error);
  }
};





  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div>
          <header>
            <img src="/hero.png" alt="" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {Array.isArray(trendMovies) && trendMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendMovies.map((movie, index) => (
                  <li key={movie.id || index}>
                    <p>{index + 1}</p>
                    <img
                      src={
                        movie.poster_url ||
                        `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      }
                      alt={movie.title || "Movie"}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>
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
          </section>
        </div>
      </div>
    </main>
  );
}


export default App;