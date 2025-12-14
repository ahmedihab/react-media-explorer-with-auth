// src/Moviedetails.jsx

import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'; 

// 🔑 CORRECT PATH DEFINITION: Reference the image directly from the public root folder
// based on your file structure (public/image-not-found.png)
const FALLBACK_IMAGE_URL = '/image-not-found.png'; 

const V3_API_KEY = 'c03a1ffd7f00fe2d6cb5ec83a721be12'; 
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMDNhMWZmZDdmMDBmZTJkNmNiNWVjODRhNzIxYmUxMiIsIm5iZiI6MTYwNzQwMjE1OS4xNjcsInN1YiI6IjVmY2YwMmFmZmJhNjI1MDAzZDdkM2M0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UjAJH1GpkSTm3FP67e0nRtxR5O12AXsznjBmAekuEsI';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function Moviedetails() {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(true); 
    let params = useParams(); 

    const getMovieDetails = useCallback(async () => {
        setIsLoading(true); 

        if (!V3_API_KEY || !ACCESS_TOKEN) {
            console.error("TMDB Keys are missing.");
            setIsLoading(false); 
            return;
        }     
        try {
            const url = `https://api.themoviedb.org/3/movie/${params.id}?api_key=${V3_API_KEY}`;
            let { data } = await axios.get(url); 
            setMovie(data);
        }catch (error) {
            console.error("Error fetching movie details:", error);
            setMovie({}); 
        } finally {
            setIsLoading(false); 
        }
    }, [params.id]);

    //  Call fetch function when the component mounts or ID changes
    useEffect(() => {
        getMovieDetails();
    }, [getMovieDetails]); 

    return (
        <div className='py-5 text-light'>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                movie.id ? (
                    <div className='row'>
                        <div className='col-md-4'>
                            <img 
                                className='w-100' 
                                
                                // 🔑 1. Check for poster_path, use FALLBACK_IMAGE_URL if null
                                src={movie.poster_path 
                                    ? `${IMAGE_BASE_URL}${movie.poster_path}` 
                                    : FALLBACK_IMAGE_URL 
                                } 
                                alt={movie.title} 
                                
                                // 🔑 2. Use onError to handle broken links/network errors
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop
                                    e.target.src = FALLBACK_IMAGE_URL; // Set fallback on failure
                                }}
                            />
                        </div>
                        <div className='col-md-8'>
                            <h2>{movie.title}</h2>
                            <h3 className='h5 text-muted'>{movie.tagline}</h3>
                            <p>Rating: ⭐️ {movie.vote_average?.toFixed(1)} / 10</p>
                            
                            <div className='my-3'>
                                {movie.genres?.map((genre, index) => (
                                    <span key={index} className='badge bg-info text-dark me-2'>
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            <p className='mt-4'>{movie.overview}</p>
                            <p>Release Date: {movie.release_date}</p>
                        </div>
                    </div>
                ) : (
                    <div className="vh-100 d-flex justify-content-center align-items-center">
                        <p>Movie details not found.</p>
                    </div>
                )
            )}
        </div>
    );
}