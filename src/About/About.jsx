import React from 'react';

export default function About() {
  return (
    <div className='py-5 text-light'>
        <h2 className='mb-4'>🎬 About Our Media Explorer</h2>
        <div className="brdr my-4 w-100"></div>

        <section className='mb-5'>
            <h3 className='h4 mb-3 text-info'>Explore, Discover, and Track</h3>
            <p className='lead'>
                Welcome to Media Explorer, your one-stop application for diving into the vast world of movies and TV shows. Whether you're hunting for the latest blockbuster, revisiting a classic series, or tracking trending actors, we provide a seamless and personalized browsing experience.
            </p>
            <p>
                Our platform fetches real-time data on the most popular and highly-rated media, giving you detailed information, ratings, genres, and overviews for every title.
            </p>
        </section>

        <section className='mb-5'>
            <h3 className='h4 mb-3 text-info'>Key Features</h3>
            <ul className="list-unstyled">
                <li className='mb-2'>
                    <strong className='text-warning'>Trending Media:</strong> See what's currently popular in movies and TV, updated weekly.
                </li>
                <li className='mb-2'>
                    <strong className='text-warning'>Detailed Views:</strong> Access comprehensive pages for every movie and TV show, including cast information and release dates.
                </li>
                <li className='mb-2'>
                    <strong className='text-warning'>User Authentication:</strong> Secure login/registration powered by Firebase for a personalized experience.
                </li>
                <li className='mb-2'>
                    <strong className='text-warning'>Personal Watchlist (Future Feature):</strong> Seamlessly add or remove movies and TV shows to your personal list (Watchlist integration is ready on the backend).
                </li>
            </ul>
        </section>

        <section className='mb-5'>
            <h3 className='h4 mb-3 text-info'>Tech Stack & Performance</h3>
            <p>
                This application is a modern single-page application (SPA) built using the following robust technologies:
            </p>
            <div className="row">
                <div className="col-md-6">
                    <ul className="list-unstyled">
                        <li><strong>Frontend:</strong> React.js & React Router DOM for dynamic routing.</li>
                        <li><strong>State Management:</strong> React Context API for centralized data fetching and state sharing.</li>
                        <li><strong>Styling:</strong> Bootstrap 5 for responsive design and clean layout.</li>
                    </ul>
                </div>
                <div className="col-md-6">
                    <ul className="list-unstyled">
                        <li><strong>Data Source:</strong> The Movie Database (TMDB) API for all media content.</li>
                        <li><strong>Authentication:</strong> Firebase Authentication for secure user management.</li>
                        <li><strong>Data Fetching:</strong> Axios for making efficient HTTP requests.</li>
                    </ul>
                </div>
            </div>
            <p className='mt-3 text-muted fst-italic'>
                This structure ensures fast navigation and a responsive user interface.
            </p>
        </section>

        <div className="brdr my-4 w-100"></div>
        <p className='text-center text-muted'>
            Developed as a project to demonstrate full-stack integration and modern front-end development practices.
        </p>

    </div>
  )
}