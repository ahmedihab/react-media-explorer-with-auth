// src/Movies/Movies.jsx

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { MediaContext } from '../MediaContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom'; // Import Link for navigation

// Define constants for image paths (reused from other components)
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMAGE_URL = '/image-not-found.png';

export default function Movies() {
    // Use the useContext hook to access the getMediaList function
    const { getMediaList } = useContext(MediaContext);
    
    const [popularMovies, setPopularMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPopularMovies = useCallback(async () => {
        setIsLoading(true);
        try {
            //  Call the context function to fetch the 'popular' movies list, page 1
            const data = await getMediaList('movie', 'popular', 1);
            setPopularMovies(data.results);
        } catch (error) {
            console.error("Failed to fetch popular movies:", error);
            setPopularMovies([]);
        } finally {
            setIsLoading(false);
        }
    }, [getMediaList]);

    useEffect(() => {
        fetchPopularMovies();
    }, [fetchPopularMovies]);

    return (
        <div className='py-5 text-light'>
            <h2>Movies</h2>
            
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className='row'>
                    {popularMovies.length > 0 ? (
                        popularMovies.map((movie) => (
                            <div className='col-md-2 mb-4' key={movie.id}>
                                
                                {/*  ADDED: Link wrapping the entire media item */}
                                <Link to={`/moviedetails/${movie.id}`} className='text-light text-decoration-none'>
                                    <div className='media-item position-relative'>
                                        <img
                                            className='w-100'
                                            src={movie.poster_path 
                                                ? `${IMAGE_BASE_URL}${movie.poster_path}` 
                                                : FALLBACK_IMAGE_URL
                                            }
                                            alt={movie.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = FALLBACK_IMAGE_URL;
                                            }}
                                        />
                                        <h3 className='h6 mt-2 text-center'>{movie.title}</h3>
                                    </div>
                                </Link>
                                
                            </div>
                        ))
                    ) : (
                        <div className="text-center w-100">
                            <p>No movies found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}