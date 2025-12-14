import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJPWGAeoXggJwIu4RZ5I83pxyqRzPjooI",
  authDomain: "react-movies-3bf4b.firebaseapp.com",
  projectId: "react-movies-3bf4b",
  storageBucket: "react-movies-3bf4b.firebasestorage.app",
  messagingSenderId: "362759287898",
  appId: "1:362759287898:web:c33b31ed4d17300c9f5463",
  measurementId: "G-MMT93HL1TE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);