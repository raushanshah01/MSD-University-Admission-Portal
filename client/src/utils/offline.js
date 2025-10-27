// Offline detection and handling utility

export const isOnline = () => navigator.onLine;

export const setupOfflineDetection = (onOnline, onOffline) => {
  const handleOnline = () => {
    console.log('Connection restored');
    if (onOnline) onOnline();
  };

  const handleOffline = () => {
    console.log('Connection lost');
    if (onOffline) onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Queue for offline actions
class OfflineQueue {
  constructor() {
    this.queue = this.loadQueue();
  }

  loadQueue() {
    try {
      const stored = localStorage.getItem('offlineQueue');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveQueue() {
    try {
      localStorage.setItem('offlineQueue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  add(action) {
    this.queue.push({
      ...action,
      timestamp: Date.now(),
      id: `${Date.now()}_${Math.random()}`
    });
    this.saveQueue();
  }

  getAll() {
    return [...this.queue];
  }

  remove(id) {
    this.queue = this.queue.filter(item => item.id !== id);
    this.saveQueue();
  }

  clear() {
    this.queue = [];
    localStorage.removeItem('offlineQueue');
  }
}

export const offlineQueue = new OfflineQueue();
