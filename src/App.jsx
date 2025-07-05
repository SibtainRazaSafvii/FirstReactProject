import React from 'react'
import { useState,useEffect } from 'react'
import './App.css'
import Search from './components/search'
import Spinner from './components/Spinner'

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
  const [movieList,setmovieList] = useState([]);
  const [isLoading,setisLoading] = useState(false);

  const fetchMovies = async () => {
    setisLoading(true)
    setErrorMessage("");
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      if(data.response ==='False'){
        setErrorMessage(data.Error || "Failed to Fetch Movies")
        setmovieList([]);
        return;

      }
      setmovieList(data.results || [])


    } catch (error) {
      console.error("Error catching Movies", error);
      setErrorMessage("Error fetching Movies please try again");
    } finally{
      setisLoading(false)
    }
  };

  // ✅ useEffect must be inside App()
  useEffect(() => {
    fetchMovies();
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
<h1 className="text-white">{searchTerm}</h1>
</header>

<section className="all-movies">
  <h2 className='mt-[40px]'>All Movies</h2>
  {isLoading ? (
      <Spinner />

  ) : errorMessage ? (
    <p className="text-red-500">{errorMessage}</p>
  ) : (
    <ul>
      {movieList.map((movie) => (
         <p key={movie.id} className="text-white">
          {movie.title}</p>
        
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
