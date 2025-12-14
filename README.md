# React Media Explorer (TMDB Client)

A dynamic media discovery application built with **React**, leveraging the **The Movie Database (TMDB) API** for content and **Firebase** for user authentication and state management.

## ✨ Features

This application provides a comprehensive media browsing experience:

* **Firebase Authentication:** Secure user registration, login, and protected routes.
* **Protected Routing:** Ensures unauthorized users cannot access core content pages (`/movies`, `/tv`).
* **Real-Time Search:** Instantaneous, multi-media searching (Movies, TV Shows, People) powered by the TMDB API, triggered as the user types.
* **Media Context Management:** Centralized state management for API functions, replacing the need for Redux.
* **Detailed Views:** Dedicated pages (`/moviedetails/:id` and `/tvdetails/:id`) to fetch and display specific media information.
* **Watchlist Feature Ready:** The application architecture is prepared for the integration of the TMDB watchlist functionality.

## 🛠️ Tech Stack & Libraries

The following key technologies and libraries were used to build this project:

| Category | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Core** | **React** | Core library for building the User Interface. |
| **Routing** | **React Router DOM** | Handles client-side navigation and routing (e.g., `/search/:query`). |
| **API Requests** | **Axios** | HTTP client for making Promise-based requests to the TMDB API. |
| **Data Source** | **TMDB API** | Provides all movie, TV show, and person data. |
| **State Management** | **React Context API** | Centralized state management via `MediaContext.js`. |
| **User Auth** | **Firebase (Authentication)** | Handles all user sign-up, sign-in, and session management. |
| **Styling** | **Bootstrap / Custom CSS** | Responsive styling and layout utility. |

## 🔑 Key Architectural Files and Context Functions

The core logic and data flow are managed through the Context API:

### `src/MediaContext.js` Functions

This file acts as the primary data service, wrapping all necessary TMDB API calls:

| Function | Description |
| :--- | :--- |
| `getTrending(mediaType, callback)` | Fetches the top trending media items for the home page. |
| `getMediaDetails(mediaType, id)` | Fetches comprehensive data for a single movie or TV show. |
| `searchMedia(query)` | **(New Feature)** Fetches real-time multi-search results based on user input. |
| `toggleWatchlist(...)` | (Placeholder) Function designed to handle adding/removing items from the user's TMDB Watchlist. |

### Core File Structure

* **`src/App.js`**: Manages the Firebase user state (`userData`) and defines all primary application routes, including the dynamic `/search/:query` route.
* **`src/Navbar/Navbar.jsx`**: Implements the real-time search input using `useState`, manages handlers, and uses `useNavigate` for dynamic routing.
* **`src/SearchResults/SearchResults.jsx`**: Retrieves the search parameter via `useParams()` and executes the `searchMedia` function from `MediaContext`.

## ⚙️ Getting Started

### Prerequisites

* Node.js (LTS version)
* A TMDB API Key
* A Firebase Project

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/ahmedihab/react-media-explorer-with-auth.git](https://github.com/ahmedihab/react-media-explorer-with-auth.git)
    cd react-media-explorer-with-auth
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a file named `.env.local` in the root directory and add your configuration keys:
    ```
    REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
    # Include Firebase Config variables (e.g., REACT_APP_FIREBASE_API_KEY, etc.)
    ```

4.  **Run the Application:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

---
