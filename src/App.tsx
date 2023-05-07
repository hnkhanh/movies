import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import Skeleton from './components/Skeleton';
import { Movie, ViewMode, Tab, MovieResponse } from './types/movies.types';

const API_URL = `https://api.themoviedb.org/3`;
const API_KEY = 'be3b358e2ff02d5fa837cb9f1c79ed52';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Grid);
  const [tab, setTab] = useState<Tab>(Tab.NowPlaying);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const filteredMovies = useMemo(() => {
    let filtered = movies;
    if (searchTerm.length)
      filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return filtered;
  }, [movies, searchTerm]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        let url = '';
        if (tab === Tab.NowPlaying) {
          url = `${API_URL}/movie/now_playing?api_key=${API_KEY}`;
        } else if (tab === Tab.TopRated) {
          url = `${API_URL}/movie/top_rated?api_key=${API_KEY}`;
        }

        const response = await axios.get<MovieResponse>(url, {
          params: { api_key: API_KEY, page },
        });

        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSelectedMovieId(null);
      } catch (error) {
        setError('Failed to fetch movies. Please try again later.');
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [tab, page]);

  const switchViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const switchTab = (newTab: Tab) => {
    if (newTab === tab) return;
    setSearchTerm('');
    setTab(newTab);
    setPage(1);
  };

  const selectMovie = (movie: Movie) => {
    setSelectedMovieId(movie.id);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const goToPreviousPage = () => {
    setPage((prevPage) => prevPage - 1);
    setSearchTerm('');
  };

  const goToNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    setSearchTerm('');
  };

  const renderMovies = () => {
    if (loading && viewMode === ViewMode.Grid) {
      return Array.from({ length: 8 }, (_, index) => <Skeleton key={index} />);
    }
    if (error) {
      return <div className='error-state'>{error}</div>;
    }
    if (filteredMovies.length === 0) {
      return <div>No movies found.</div>;
    }
    return filteredMovies.map((movie) => (
      <div
        className={`movie-card ${selectedMovieId === movie.id ? 'selected' : ''}`}
        key={movie.id}
        onClick={() => selectMovie(movie)}
      >
        <div className={`card-content`}>
          <img
            className='poster'
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            loading='lazy'
            alt={movie.title}
          />
          <div>
            <div className='title'>{movie.title}</div>
            <p className='stats'>Rating: {movie.vote_average}</p>
          </div>

          {selectedMovieId === movie.id && (
            <div className='movie-details-overlay'>
              <div className='movie-details'>
                <div className='title'>{movie.title}</div>

                <p>{movie.overview}</p>
                <p className='stats'>Release date: {movie.release_date}</p>
                <p className='stats'>Rating: {movie.vote_average}</p>
                <p className='stats'>Votes: {movie.vote_count}</p>
                <p className='stats'>Popularity: {movie.popularity}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className='movies-app'>
      <header className='app-header'>
        <h1>Movies</h1>

        <div className='search-bar'>
          <input
            type='text'
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder='Search movies...'
          />
        </div>

        <div className='tabs'>
          <button
            className={tab === Tab.NowPlaying ? 'active' : ''}
            onClick={() => switchTab(Tab.NowPlaying)}
          >
            Now Playing
          </button>
          <button
            className={tab === Tab.TopRated ? 'active' : ''}
            onClick={() => switchTab(Tab.TopRated)}
          >
            Top Rated
          </button>
        </div>

        <div className='view-mode-switch'>
          <button
            className={`view-mode-btn ${viewMode === ViewMode.List ? 'active' : ''}`}
            onClick={() => switchViewMode(ViewMode.List)}
          >
            List
          </button>
          <button
            className={`view-mode-btn ${viewMode === ViewMode.Grid ? 'active' : ''}`}
            onClick={() => switchViewMode(ViewMode.Grid)}
          >
            Grid
          </button>
        </div>
      </header>

      <div className={`movie-list ${viewMode}`}>{renderMovies()}</div>

      {!!totalPages && !loading && !searchTerm.length && (
        <div className='pagination'>
          <button onClick={() => setPage(1)} disabled={page === 1}>
            {'<<'}
          </button>
          <button onClick={goToPreviousPage} disabled={page === 1}>
            {'<'}
          </button>
          <button onClick={goToNextPage} disabled={page === totalPages}>
            {'>'}
          </button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>
            {'>>'}
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default Movies;
