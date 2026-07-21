// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

// Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Authentication (for future login)
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Storage (for future receipt uploads)
import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// Analytics (optional)
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

// Firebase Configuration
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

// Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Analytics (works only on supported environments)
let analytics = null;

try {
    analytics = getAnalytics(app);
} catch (e) {
    console.log("Analytics not available.");
}

// Export everything
export {
    app,
    db,
    auth,
    storage,
    analytics
};
