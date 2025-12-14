// src/MediaContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// 1. Define and Export the Context
export const MediaContext = createContext();

// 🔑 TMDB API Configuration (USING YOUR PROVIDED KEYS)
const V3_API_KEY = 'c03a1ffd7f00fe2d6cb5ec83a721be12'; 
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMDNhMWZmZDdmMDBmZTJkNmNiNWVjODRhNzIxYmUxMiIsIm5iZiI6MTYwNzQwMjE1OS4xNjcsInN1YiI6IjVmY2ZowjhmZmJhNjI1MDAzZDdkM2M0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UjAJH1GpkSTm3FP67e0nRtxR5O12AXsznjBmAekuEsI';

const BASE_URL = 'https://api.themoviedb.org/3'; 

// 2. Define and Export the Provider Component (Corrected Name: MediaContextProvider)
export function MediaContextProvider(props) {
    // Trending States
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingTv, setTrendingTv] = useState([]);
    const [trendingPeople, setTrendingPeople] = useState([]);
    
    // Watchlist States
    const [movieWatchlist, setMovieWatchlist] = useState([]);
    const [tvWatchlist, setTvWatchlist] = useState([]);


    // 🚀 FUNCTION TO FETCH TRENDING DATA
    async function getTrending(mediaType, callback) {
        if (!V3_API_KEY || !ACCESS_TOKEN) {
            console.error("TMDB Keys are missing. Please ensure V3_API_KEY and ACCESS_TOKEN are defined.");
            return;
        }

        const url = `${BASE_URL}/trending/${mediaType}/week?api_key=${V3_API_KEY}`; 
        
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        try {
            let { data } = await axios.get(url, options);
            callback(data.results.slice(0, 10)); 
        } catch (error) {
            console.error(`Error fetching trending ${mediaType}:`, error.response ? error.response.data : error.message);
        }
    }
    
    // 🔑 GENERIC FUNCTION TO FETCH DETAILS FOR ONE ITEM
    const getMediaDetails = useCallback(async (mediaType, id) => {
        if (!V3_API_KEY || !id) {
            console.error("TMDB API Key or Media ID is missing.");
            return null;
        }
        
        const url = `${BASE_URL}/${mediaType}/${id}?api_key=${V3_API_KEY}`;
        
        try {
            const { data } = await axios.get(url); 
            return data;
        } catch (error) {
            console.error(`Error fetching ${mediaType} details for ID ${id}:`, error.response ? error.response.data : error.message);
            return null; 
        }
    }, []);
    
    // 🔑 GENERIC FUNCTION TO FETCH LISTS
    async function getMediaList(type, listType, page = 1) {
        if (!V3_API_KEY) {
            console.error("TMDB API Key is missing.");
            return { results: [], total_pages: 1 };
        }
        
        const url = `${BASE_URL}/${type}/${listType}?api_key=${V3_API_KEY}&page=${page}`;
        
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };
        
        try {
            let { data } = await axios.get(url, options);
            
            return {
                results: data.results,
                total_pages: data.total_pages,
                page: data.page 
            };
        } catch (error) {
            console.error(`Error fetching ${type} ${listType}:`, error.response ? error.response.data : error.message);
            return { results: [], total_pages: 1 };
        }
    }
    
    // -----------------------------------------------------------
    // 🔑 NEW: SEARCH MEDIA FUNCTION
    // -----------------------------------------------------------
    const searchMedia = useCallback(async (query) => {
        if (!V3_API_KEY || !query.trim()) return [];

        const url = `${BASE_URL}/search/multi?api_key=${V3_API_KEY}&query=${encodeURIComponent(query)}`;
        
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        try {
            const { data } = await axios.get(url, options);
            
            // Filter out items without a poster path or profile path for cleaner display
            return data.results.filter(item => item.poster_path || item.profile_path);
        } catch (error) {
            console.error("Error searching media:", error.response ? error.response.data : error.message);
            return [];
        }
    }, []);

    // 🔑 FUNCTION TO GET A USER'S WATCHLIST 
    async function getWatchlist(accountId, mediaType) {
        if (!V3_API_KEY || !accountId) {
            console.error("TMDB Keys or Account ID are missing for Watchlist API.");
            return;
        }

        const url = `${BASE_URL}/account/${accountId}/watchlist/${mediaType}?api_key=${V3_API_KEY}`;
        
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        try {
            const { data } = await axios.get(url, options);
            
            if (mediaType === 'movies') {
                setMovieWatchlist(data.results || []);
            } else if (mediaType === 'tv') {
                setTvWatchlist(data.results || []);
            }
            
        } catch (error) {
            console.error(`Error fetching ${mediaType} watchlist for account ${accountId}:`, error.response ? error.response.data : error.message);
        }
    }

    // 🔑 FUNCTION TO ADD/REMOVE A MOVIE OR TV SHOW TO/FROM THE WATCHLIST
    async function toggleWatchlist(accountId, mediaType, mediaId, addToList) {
        if (!ACCESS_TOKEN || !accountId) {
            console.error("Access Token or Account ID missing for Watchlist toggle.");
            return false;
        }

        const url = `${BASE_URL}/account/${accountId}/watchlist?api_key=${V3_API_KEY}`;

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`
            },
            data: {
                media_type: mediaType,
                media_id: mediaId,
                watchlist: addToList 
            }
        };

        try {
            await axios.post(url, options.data, { headers: options.headers });
            
            // Re-fetch the watchlist data to update state immediately after a successful toggle
            getWatchlist(accountId, mediaType === 'movie' ? 'movies' : 'tv');

            return true;
        } catch (error) {
            console.error(`Error toggling watchlist for ${mediaType} ${mediaId}:`, error.response ? error.response.data : error.message);
            return false;
        }
    }


    // 🔄 useEffect runs once on mount to fetch all trending data
    useEffect(() => {
        getTrending('movie', setTrendingMovies); 
        getTrending('tv', setTrendingTv);
        getTrending('person', setTrendingPeople);
    }, []); 

    // 3. Define the Context Value
    const contextValue = {
        trendingMovies,
        trendingTv,
        trendingPeople,
        movieWatchlist, 
        tvWatchlist, 
        getTrending,
        getMediaList, 
        getMediaDetails,
        searchMedia, // 🔑 EXPORT THE NEW SEARCH FUNCTION
        getWatchlist,
        toggleWatchlist,
        setMovieWatchlist,
        setTvWatchlist,
    };

    // 4. Return the Provider wrapping children with the value
    return (
        <MediaContext.Provider value={contextValue}>
            {props.children}
        </MediaContext.Provider>
    );
}