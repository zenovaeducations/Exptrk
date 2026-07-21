// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkuoUAAr7zEQICxlnimpz1XUFKJA3hPA8",
  authDomain: "best-f6d59.firebaseapp.com",
  projectId: "best-f6d59",
  storageBucket: "best-f6d59.firebasestorage.app",
  messagingSenderId: "422817936552",
  appId: "1:422817936552:web:6d8bfeb0efab2e6302fe9d",
  measurementId: "G-QVZZK9T59X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

export { db };
