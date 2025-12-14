// src/Footer/Footer.jsx

import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-dark text-light text-center py-3 fixed-bottom">
            <div className="container">
                <p className="m-0">
                    &copy; {new Date().getFullYear()} Noxe. All rights reserved. 
                    <span className="d-block d-sm-inline ms-sm-3">Powered by The Movie Database (TMDB) API.</span>
                </p>
                {/* 🔑 ADDED: The specific class 'footer-icons' */}
                <div className="mt-2 footer-icons"> 
                    <i className="fab fa-facebook-f mx-2"></i>
                    <i className="fab fa-instagram mx-2"></i>
                    <i className="fab fa-youtube mx-2"></i>
                </div>
            </div>
        </footer>
    );
}