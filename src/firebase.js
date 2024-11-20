import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWcci-dVdd0WOWk4jgJqEtTKc9uoLn0BA",
  authDomain: "e-commers-web-a028b.firebaseapp.com",
  projectId: "e-commers-web-a028b",
  storageBucket: "e-commers-web-a028b.firebasestorage.app",
  messagingSenderId: "562419172473",
  appId: "1:562419172473:web:ce0f48d779c812588140a8",
  databaseURL: "https://e-commers-web-a028b-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); 