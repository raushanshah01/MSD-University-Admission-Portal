// Performance monitoring and optimization utilities

/**
 * Measure component render time
 */
export const measureRenderTime = (componentName, callback) => {
  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();
  
  if (endTime - startTime > 16) { // More than one frame (60fps)
    console.warn(`${componentName} took ${(endTime - startTime).toFixed(2)}ms to render`);
  }
  
  return result;
};

/**
 * Debounce function to limit function calls
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function calls
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Lazy load images
 */
export const lazyLoadImage = (imageElement) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    imageObserver.observe(imageElement);
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    imageElement.src = imageElement.dataset.src;
  }
};

/**
 * Prefetch resource
 */
export const prefetch = (url, as = 'fetch') => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
};

/**
 * Cache API response
 */
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheResponse = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const getCachedResponse = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

/**
 * Monitor page load performance
 */
export const monitorPageLoad = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        if (perfData) {
          console.log('Performance Metrics:');
          console.log(`DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
          console.log(`Full Page Load: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
          console.log(`DNS Lookup: ${perfData.domainLookupEnd - perfData.domainLookupStart}ms`);
          console.log(`TCP Connection: ${perfData.connectEnd - perfData.connectStart}ms`);
          console.log(`Request Time: ${perfData.responseEnd - perfData.requestStart}ms`);
        }
      }, 0);
    });
  }
};

/**
 * Request Idle Callback wrapper
 */
export const requestIdleCallback = (callback, options) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  // Fallback
  return setTimeout(callback, 1);
};

/**
 * Optimize images
 */
export const optimizeImage = (src, width, quality = 80) => {
  // This would integrate with an image optimization service
  // For now, return the original src
  return src;
};

/**
 * Batch DOM updates
 */
export const batchUpdate = (updates) => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

/**
 * Detect slow network
 */
export const isSlowNetwork = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
  }
  return false;
};

/**
 * Service Worker registration for offline support
 */
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
};

/**
 * Clear performance marks
 */
export const clearPerformanceMarks = () => {
  if ('performance' in window && 'clearMarks' in performance) {
    performance.clearMarks();
    performance.clearMeasures();
  }
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  monitorPageLoad();
}
