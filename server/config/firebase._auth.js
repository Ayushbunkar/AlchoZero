// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjPs8l-PKtwIak7A4NMVreRG_82PuMozc",
  authDomain: "fftour-5ac79.firebaseapp.com",
  databaseURL: "https://fftour-5ac79-default-rtdb.firebaseio.com",
  projectId: "fftour-5ac79",
  storageBucket: "fftour-5ac79.appspot.com",
  messagingSenderId: "427551679783",
  appId: "1:427551679783:web:d06f826095739e58ebf502",
  measurementId: "G-GK7ZXB0HQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);