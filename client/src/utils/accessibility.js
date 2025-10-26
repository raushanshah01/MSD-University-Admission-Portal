// Accessibility utilities for the application

/**
 * Generate accessible labels for form fields
 */
export const getAriaLabel = (fieldName, required = false) => {
  const label = fieldName.replace(/([A-Z])/g, ' $1').trim();
  return required ? `${label} (required)` : label;
};

/**
 * Announce screen reader messages
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

/**
 * Keyboard navigation helper
 */
export const handleKeyboardNavigation = (event, onEnter, onEscape) => {
  if (event.key === 'Enter' && onEnter) {
    event.preventDefault();
    onEnter();
  } else if (event.key === 'Escape' && onEscape) {
    event.preventDefault();
    onEscape();
  }
};

/**
 * Focus trap for modals
 */
export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  return () => element.removeEventListener('keydown', handleTabKey);
};

/**
 * Skip to main content
 */
export const skipToMainContent = () => {
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
  }
};

/**
 * Check color contrast ratio (WCAG AA compliance)
 */
export const checkColorContrast = (foreground, background) => {
  // Simplified contrast check - returns true if passes WCAG AA (4.5:1)
  // Full implementation would convert colors and calculate luminance
  return true; // Placeholder
};

/**
 * Add keyboard shortcuts
 */
export const keyboardShortcuts = {
  SAVE: { key: 's', ctrl: true, description: 'Save form' },
  SUBMIT: { key: 'Enter', ctrl: true, description: 'Submit form' },
  CANCEL: { key: 'Escape', description: 'Cancel/Close' },
  NEXT: { key: 'ArrowRight', ctrl: true, description: 'Next step' },
  PREVIOUS: { key: 'ArrowLeft', ctrl: true, description: 'Previous step' },
};

/**
 * Initialize keyboard shortcuts
 */
export const initKeyboardShortcuts = (handlers) => {
  const handleKeyDown = (event) => {
    Object.entries(handlers).forEach(([action, handler]) => {
      const shortcut = keyboardShortcuts[action];
      if (!shortcut) return;

      const matches = 
        event.key === shortcut.key &&
        (!shortcut.ctrl || event.ctrlKey || event.metaKey) &&
        (!shortcut.shift || event.shiftKey) &&
        (!shortcut.alt || event.altKey);

      if (matches) {
        event.preventDefault();
        handler();
      }
    });
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
};
