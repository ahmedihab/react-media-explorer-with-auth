import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 🔑 Import useNavigate
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

// 🔑 Accept userData as a prop from App.js
export default function Navbar({ userData }) {
    
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    
    // --- LOGOUT HANDLER ---
    async function logOut() {
        try {
            await signOut(auth);
            console.log("User signed out successfully.");
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    // --- SEARCH HANDLERS ---
    
    // 1. Updates state when the input value changes (Real-Time Search Trigger)
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        // 🔑 REAL-TIME SEARCH IMPLEMENTATION:
        // Immediately navigate/search if the query is not empty.
        // This causes navigation and re-renders of SearchResults component as you type.
        if (value.trim()) {
            navigate(`/search/${value.trim()}`);
        } else {
            // Optional: If the user deletes the entire query, navigate back to 'home'
            navigate('/home'); 
        }
    };

    // 2. Triggers search submission (called by Enter key or the Search Icon)
    const handleSearchSubmit = (e) => {
        // This handler now ensures the navigation happens whether it's an 'Enter' key press
        // or a direct click on the icon. We also prevent double-navigation 
        // if handleSearchChange already ran.
        
        const isEnterKey = e.key === 'Enter';
        const trimmedQuery = searchQuery.trim();

        // If 'Enter' is pressed, prevent default behavior
        if (isEnterKey) {
             e.preventDefault(); 
        }
        
        // Navigate only if the query is valid and it's either an icon click 
        // or the 'Enter' key press, otherwise, handleSearchChange already handled it.
        if (trimmedQuery && (isEnterKey || e.type === 'click')) {
            navigate(`/search/${trimmedQuery}`); 
            // NOTE: Do NOT clear searchQuery here for real-time search, 
            // otherwise the user loses the text in the box.
        }
    };


    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-trancparent">
                <div className="container-fluid">
                    <Link className="navbar-brand fw-bold" to="home">Noxe</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* -------------------- START: LEFT SIDE NAVIGATION -------------------- */}
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link active" to="home">Home</Link>
                            </li>

                            {userData ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="tv">Tv</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="movies">Movies</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="about">About</Link>
                                    </li>
                                </>
                            ) : null}
                            
                        </ul>

                        <ul className="navbar-nav mb-2 mb-lg-0">
                            
                            {/* 🔑 UPDATED SEARCH INPUT WITH ICON */}
                            <li className="nav-item d-flex align-items-center me-3">
                                {/* Wrap in a container to position the icon, assuming search-box is position: relative */}
                                <div className="search-box position-relative d-flex align-items-center"> 
                                    <input 
                                        type="text" 
                                        placeholder="Search movies or TV..." 
                                        value={searchQuery} // Controlled input
                                        onChange={handleSearchChange} // Triggers real-time search via navigation
                                        onKeyDown={handleSearchSubmit} // Optional: Keep for explicit 'Enter' behavior
                                    />
                                    {/* 🔑 SEARCH ICON SUBMIT BUTTON */}
                                    <i 
                                        className="fas fa-search  text-white ms-2" 
                                        onClick={handleSearchSubmit} // Trigger search submission on click
                                        style={{cursor: 'pointer'}} // Indicate clickability
                                    ></i>
                                </div>
                            </li>

                            <li className="nav-item d-flex align-items-center">
                                <div className="social-icons">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f mx-2"></i></a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram mx-2"></i></a>
                                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube mx-2"></i></a>
                                    <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-dribbble mx-2"></i></a>
                                </div>
                            </li>

                            {/* CONDITIONAL AUTH LINKS */}
                            {userData ? (
                                <li className="nav-item">
                                    <span className="nav-link cursor-pointer" onClick={logOut} style={{ cursor: 'pointer' }}>Logout</span>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="register">Register</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="login">Login</Link>
                                    </li>
                                </>
                            )}
                            
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}