// Auto-save form data to prevent data loss

export class FormAutoSave {
  constructor(formId, saveInterval = 30000) {
    this.formId = formId;
    this.saveInterval = saveInterval;
    this.timer = null;
    this.storageKey = `autosave_${formId}`;
  }

  // Start auto-saving
  start(getFormData) {
    this.getFormData = getFormData;
    
    // Save immediately
    this.save();
    
    // Set up interval
    this.timer = setInterval(() => {
      this.save();
    }, this.saveInterval);
    
    console.log(`Auto-save started for ${this.formId}`);
  }

  // Stop auto-saving
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log(`Auto-save stopped for ${this.formId}`);
    }
  }

  // Save form data
  save() {
    if (!this.getFormData) return;
    
    try {
      const data = this.getFormData();
      const saveData = {
        data,
        timestamp: new Date().toISOString(),
        version: 1
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(saveData));
      console.log(`Form auto-saved at ${new Date().toLocaleTimeString()}`);
      
      // Show subtle indicator
      this.showSaveIndicator();
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  // Load saved data
  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return null;
      
      const { data, timestamp } = JSON.parse(saved);
      
      // Check if data is not too old (7 days)
      const savedDate = new Date(timestamp);
      const daysDiff = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 7) {
        this.clear();
        return null;
      }
      
      return { data, timestamp };
    } catch (error) {
      console.error('Failed to load auto-saved data:', error);
      return null;
    }
  }

  // Clear saved data
  clear() {
    localStorage.removeItem(this.storageKey);
    console.log(`Auto-save data cleared for ${this.formId}`);
  }

  // Check if there's saved data
  hasSavedData() {
    return localStorage.getItem(this.storageKey) !== null;
  }

  // Show save indicator
  showSaveIndicator() {
    const indicator = document.getElementById('autosave-indicator');
    if (indicator) {
      indicator.textContent = '✓ Saved';
      indicator.style.opacity = '1';
      
      setTimeout(() => {
        indicator.style.opacity = '0';
      }, 2000);
    }
  }
}

// Create a global auto-save indicator element
export const createAutoSaveIndicator = () => {
  if (document.getElementById('autosave-indicator')) return;
  
  const indicator = document.createElement('div');
  indicator.id = 'autosave-indicator';
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(indicator);
};
