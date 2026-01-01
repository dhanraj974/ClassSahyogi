# Database Setup Guide for ClassSahyogi

## Overview
This system now supports cloud database synchronization, allowing users to access their data from any device.

## Setup Options

### Option 1: Firebase Firestore (Recommended)

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "ClassSahyogi" (or your preferred name)
4. Follow the setup wizard

#### Step 2: Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create Database"
3. Start in "Test Mode" (for development)
4. Choose a location closest to your users
5. Click "Enable"

#### Step 3: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register your app
5. Copy the Firebase configuration object

#### Step 4: Update Configuration
1. Open `firebase-config.js`
2. Replace the placeholder values with your actual Firebase config:
```javascript
const FIREBASE_CONFIG = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

3. Open `database.js`
4. Update the `firebaseConfig` object in the `DatabaseManager` constructor with the same values

#### Step 5: Set Firestore Security Rules
In Firebase Console > Firestore Database > Rules, use:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Or allow public read/write (for development only)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Option 2: REST API Backend

If you prefer a custom backend:

1. Set up a REST API server (Node.js, Python, PHP, etc.)
2. Create endpoints:
   - `POST /api/sync` - Save data
   - `GET /api/load` - Load data
3. Update `API_BACKEND_URL` in `firebase-config.js`
4. Update `database-sync.js` to use your API endpoints

## Features

### Automatic Synchronization
- Data syncs automatically every 30 seconds
- Syncs on page load
- Syncs when data changes
- Syncs before page closes

### Manual Sync
- Click the "Sync Data" button (bottom left) to manually sync
- Shows sync status notifications

### Offline Support
- Uses localStorage as backup
- Works offline with local data
- Syncs when connection is restored

## Data Collections

The following data is synced:
- `students` - Student records
- `staffData` - Staff/Teacher records
- `attendance` - Attendance records
- `marks` - Student marks
- `feesData` - Fee records
- `teamsFiles` - Shared files

## Testing

1. Add some data on one device
2. Click "Sync Data" button
3. Open the website on another device
4. Data should appear automatically

## Troubleshooting

### Data not syncing?
- Check browser console for errors
- Verify Firebase configuration is correct
- Check Firestore security rules
- Ensure internet connection is active

### Data not appearing on other devices?
- Click "Sync Data" button manually
- Check if data was saved to cloud (Firebase Console)
- Verify localStorage has data locally

## Security Notes

- For production, enable Firebase Authentication
- Set proper Firestore security rules
- Don't expose API keys in client-side code (use environment variables)
- Consider implementing user authentication

## Support

For issues or questions, check:
- Firebase Documentation: https://firebase.google.com/docs
- Firestore Documentation: https://firebase.google.com/docs/firestore

