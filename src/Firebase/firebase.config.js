// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCd-EZy_t0gWUfLDmL4Z9g4CQi7ZphGNg4",
  authDomain: "social-dev-events-platform.firebaseapp.com",
  projectId: "social-dev-events-platform",
  storageBucket: "social-dev-events-platform.firebasestorage.app",
  messagingSenderId: "89379580050",
  appId: "1:89379580050:web:749563e622907d6a66de4b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
