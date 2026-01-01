/**
 * Database Sync Manager
 * Handles automatic synchronization between localStorage and cloud database
 * 
 * Note: Make sure firebase-config.js and database.js are loaded before this file
 */

class DatabaseSync {
  constructor() {
    this.syncInProgress = false;
    this.lastSyncTime = null;
    this.syncInterval = null;
  }

  /**
   * Initialize automatic syncing
   */
  init() {
    // Load data from cloud on page load
    if (SYNC_SETTINGS.syncOnLoad) {
      this.loadFromCloud();
    }

    // Setup automatic sync interval
    if (SYNC_SETTINGS.autoSync && SYNC_SETTINGS.useCloudDatabase) {
      this.startAutoSync();
    }

    // Sync on data changes
    if (SYNC_SETTINGS.syncOnChange) {
      this.setupChangeListeners();
    }

    // Sync before page unload
    window.addEventListener('beforeunload', () => {
      this.syncToCloud();
    });
  }

  /**
   * Start automatic sync interval
   */
  startAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.syncToCloud();
    }, SYNC_SETTINGS.syncInterval);
  }

  /**
   * Sync all data to cloud
   */
  async syncToCloud() {
    if (this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      if (typeof databaseManager !== 'undefined' && databaseManager.isAvailable()) {
        const results = await databaseManager.syncAllData();
        this.lastSyncTime = new Date();
        console.log('Data synced to cloud:', results);
        this.showSyncStatus('Data synced successfully', 'success');
        return results;
      } else {
        // Fallback: Try REST API if available
        return await this.syncToAPI();
      }
    } catch (error) {
      console.error('Sync error:', error);
      this.showSyncStatus('Sync failed. Using local data.', 'warning');
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Load all data from cloud
   */
  async loadFromCloud() {
    try {
      if (typeof databaseManager !== 'undefined' && databaseManager.isAvailable()) {
        const data = await databaseManager.loadAllData();
        
        // Update localStorage with cloud data
        Object.keys(data).forEach(key => {
          if (data[key] && (Array.isArray(data[key]) ? data[key].length > 0 : data[key] !== null)) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        });

        // Only show status if not during login (to avoid interrupting login flow)
        if (!window.location.pathname.includes('index')) {
          this.showSyncStatus('Data loaded from cloud', 'success');
        }
        
        // Don't reload during login - let the login function handle navigation
        if (window.location.pathname.includes('dashboard') && !window.location.pathname.includes('index')) {
          // Only reload if we're already on a dashboard (not during login)
          setTimeout(() => {
            if (document.readyState === 'complete') {
              window.location.reload();
            }
          }, 1000);
        }
        
        return data;
      } else {
        return await this.loadFromAPI();
      }
    } catch (error) {
      console.error('Load error:', error);
      // Don't show error during login
      if (!window.location.pathname.includes('index')) {
        this.showSyncStatus('Could not load from cloud. Using local data.', 'warning');
      }
      return null;
    }
  }

  /**
   * Sync to REST API (alternative to Firebase)
   */
  async syncToAPI() {
    if (!SYNC_SETTINGS.useCloudDatabase || !API_BACKEND_URL) {
      return null;
    }

    try {
      const collections = ['students', 'staffData', 'attendance', 'marks', 'feesData', 'teamsFiles'];
      const payload = {};

      collections.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          payload[key] = JSON.parse(data);
        }
      });

      const response = await fetch(`${API_BACKEND_URL}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        this.lastSyncTime = new Date();
        return await response.json();
      }
    } catch (error) {
      console.error('API sync error:', error);
    }
  }

  /**
   * Load from REST API
   */
  async loadFromAPI() {
    if (!SYNC_SETTINGS.useCloudDatabase || !API_BACKEND_URL) {
      return null;
    }

    try {
      const response = await fetch(`${API_BACKEND_URL}/load`);
      if (response.ok) {
        const data = await response.json();
        
        Object.keys(data).forEach(key => {
          if (data[key]) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        });

        return data;
      }
    } catch (error) {
      console.error('API load error:', error);
    }
  }

  /**
   * Setup listeners for data changes
   */
  setupChangeListeners() {
    // Override localStorage.setItem to trigger sync
    const originalSetItem = localStorage.setItem;
    const self = this;

    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      
      // Sync important collections
      const syncKeys = ['students', 'staffData', 'attendance', 'marks', 'feesData', 'teamsFiles'];
      if (syncKeys.includes(key)) {
        // Debounce sync calls
        clearTimeout(self.syncTimeout);
        self.syncTimeout = setTimeout(() => {
          self.syncToCloud();
        }, 2000); // Wait 2 seconds after last change
      }
    };
  }

  /**
   * Show sync status to user
   */
  showSyncStatus(message, type = 'info') {
    // Create or update status indicator
    let statusDiv = document.getElementById('syncStatus');
    if (!statusDiv) {
      statusDiv = document.createElement('div');
      statusDiv.id = 'syncStatus';
      statusDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
      `;
      document.body.appendChild(statusDiv);
    }

    const colors = {
      success: { bg: '#28a745', color: 'white' },
      warning: { bg: '#ffc107', color: '#333' },
      error: { bg: '#dc3545', color: 'white' },
      info: { bg: '#17a2b8', color: 'white' }
    };

    const style = colors[type] || colors.info;
    statusDiv.style.background = style.bg;
    statusDiv.style.color = style.color;
    statusDiv.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (statusDiv) {
        statusDiv.style.opacity = '0';
        setTimeout(() => {
          if (statusDiv && statusDiv.parentNode) {
            statusDiv.parentNode.removeChild(statusDiv);
          }
        }, 300);
      }
    }, 3000);
  }

  /**
   * Manual sync button (for UI)
   */
  createSyncButton() {
    const button = document.createElement('button');
    button.id = 'manualSyncBtn';
    button.innerHTML = '<i class="fas fa-sync"></i> Sync Data';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    
    button.onclick = () => {
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
      this.syncToCloud().then(() => {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-sync"></i> Sync Data';
      });
    };

    document.body.appendChild(button);
  }
}

// Create global instance
const databaseSync = new DatabaseSync();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    databaseSync.init();
    databaseSync.createSyncButton();
  });
} else {
  databaseSync.init();
  databaseSync.createSyncButton();
}

