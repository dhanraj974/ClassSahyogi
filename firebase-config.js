/**
 * Firebase Configuration for ClassSahyogi
 * 
 * INSTRUCTIONS TO SETUP:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Enable Firestore Database
 * 4. Copy your Firebase config from Project Settings
 * 5. Replace the values below with your actual Firebase config
 * 6. Update database.js with your config values
 */

// Firebase Configuration - REPLACE WITH YOUR ACTUAL VALUES
// Get these from Firebase Console > Project Settings > Your apps > Web app
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// If you don't want to use Firebase, set this to false
const USE_FIREBASE = true;

// Alternative: Simple REST API Backend (if you prefer not to use Firebase)
const API_BACKEND_URL = "https://your-api-backend.com/api";

// Database sync settings
const SYNC_SETTINGS = {
  autoSync: true,           // Automatically sync data
  syncInterval: 30000,      // Sync every 30 seconds
  syncOnLoad: true,         // Sync when page loads
  syncOnChange: true,       // Sync when data changes
  useLocalStorage: true,    // Keep localStorage as backup
  useCloudDatabase: true    // Use cloud database
};

