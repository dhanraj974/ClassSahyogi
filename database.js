/**
 * Cloud Database Integration for ClassSahyogi
 * Uses Firebase Firestore for cross-device data synchronization
 */

class DatabaseManager {
  constructor() {
    // Use config from firebase-config.js if available, otherwise use defaults
    this.firebaseConfig = typeof FIREBASE_CONFIG !== 'undefined' 
      ? FIREBASE_CONFIG 
      : {
          apiKey: "AIzaSyDemoKey_ReplaceWithYourKey",
          authDomain: "classsahyogi.firebaseapp.com",
          projectId: "classsahyogi",
          storageBucket: "classsahyogi.appspot.com",
          messagingSenderId: "123456789",
          appId: "1:123456789:web:abcdef"
        };
    
    this.initialized = false;
    this.db = null;
    this.auth = null;
  }

  /**
   * Initialize Firebase (will be called when Firebase SDK is loaded)
   */
  async initialize() {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not loaded. Using localStorage only.');
      return false;
    }

    try {
      // Initialize Firebase (using compat API)
      if (!firebase.apps || firebase.apps.length === 0) {
        firebase.initializeApp(this.firebaseConfig);
      }
      
      this.db = firebase.firestore();
      this.auth = firebase.auth();
      this.initialized = true;
      
      console.log('Database initialized successfully');
      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      return false;
    }
  }

  /**
   * Save data to cloud database
   */
  async saveData(collection, data, documentId = null) {
    try {
      // Always save to localStorage first (for offline access)
      localStorage.setItem(collection, JSON.stringify(data));
      
      if (!this.initialized || !this.db) {
        console.log('Database not initialized, saved to localStorage only');
        return { success: true, local: true };
      }

      const docRef = documentId 
        ? this.db.collection(collection).doc(documentId)
        : this.db.collection(collection).doc();
      
      await docRef.set({
        data: data,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp ? firebase.firestore.FieldValue.serverTimestamp() : new Date(),
        updatedBy: this.getCurrentUserId()
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving to database:', error);
      // Fallback to localStorage
      localStorage.setItem(collection, JSON.stringify(data));
      return { success: true, local: true, error: error.message };
    }
  }

  /**
   * Load data from cloud database
   */
  async loadData(collection, documentId = 'main') {
    try {
      if (!this.initialized || !this.db) {
        // Fallback to localStorage
        const localData = localStorage.getItem(collection);
        return localData ? JSON.parse(localData) : [];
      }

      const docRef = this.db.collection(collection).doc(documentId);
      const doc = await docRef.get();

      if (doc.exists) {
        const data = doc.data().data;
        // Update localStorage with cloud data
        localStorage.setItem(collection, JSON.stringify(data));
        return data;
      } else {
        // No cloud data, try localStorage
        const localData = localStorage.getItem(collection);
        return localData ? JSON.parse(localData) : [];
      }
    } catch (error) {
      console.error('Error loading from database:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(collection);
      return localData ? JSON.parse(localData) : [];
    }
  }

  /**
   * Sync all data to cloud
   */
  async syncAllData() {
    const collections = ['students', 'staffData', 'attendance', 'marks', 'feesData', 'teamsFiles'];
    const results = {};

    for (const collection of collections) {
      try {
        const data = JSON.parse(localStorage.getItem(collection) || '[]');
        if (data.length > 0 || Array.isArray(data)) {
          const result = await this.saveData(collection, data);
          results[collection] = result;
        }
      } catch (error) {
        console.error(`Error syncing ${collection}:`, error);
        results[collection] = { success: false, error: error.message };
      }
    }

    return results;
  }

  /**
   * Load all data from cloud
   */
  async loadAllData() {
    const collections = ['students', 'staffData', 'attendance', 'marks', 'feesData', 'teamsFiles'];
    const results = {};

    for (const collection of collections) {
      try {
        const data = await this.loadData(collection);
        results[collection] = data;
      } catch (error) {
        console.error(`Error loading ${collection}:`, error);
        results[collection] = [];
      }
    }

    return results;
  }

  /**
   * Get current user ID for tracking
   */
  getCurrentUserId() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    return currentUser.id || currentUser.roll || 'anonymous';
  }

  /**
   * Setup real-time listener for data changes
   */
  setupRealtimeSync(collection, callback) {
    if (!this.initialized || !this.db) {
      return null;
    }

    try {
      return this.db.collection(collection).doc('main')
        .onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data().data;
            localStorage.setItem(collection, JSON.stringify(data));
            if (callback) callback(data);
          }
        });
    } catch (error) {
      console.error('Error setting up real-time sync:', error);
      return null;
    }
  }

  /**
   * Check if database is available
   */
  isAvailable() {
    return this.initialized && this.db !== null;
  }
}

// Create global instance
const databaseManager = new DatabaseManager();

// Auto-initialize when Firebase is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase !== 'undefined') {
      databaseManager.initialize();
    }
  });
} else {
  if (typeof firebase !== 'undefined') {
    databaseManager.initialize();
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DatabaseManager;
}

