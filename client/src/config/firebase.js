import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

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
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

// Sign in anonymously for testing (optional)
// Uncomment if you enable anonymous auth in Firebase Console
// signInAnonymously(auth).catch((error) => {
//   console.error("Anonymous auth error:", error);
// });

export { app, db, auth, analytics, storage };
