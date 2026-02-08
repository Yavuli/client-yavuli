import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { headerMonitor } from "./lib/headerMonitor";

// ==========================================
// GLOBAL ERROR HANDLERS
// ==========================================

// Initialize header monitor to detect cookie bloat early
console.log('[main.tsx] Initializing header monitor...');
if (import.meta.env.DEV) {
  headerMonitor.logReport();
  headerMonitor.startMonitoring(30000); // Check every 30 seconds in dev
}

// Handle runtime errors
window.onerror = function (message, source, lineno, colno, error) {
  console.error('[Global Error Handler]', {
    message,
    source,
    lineno,
    colno,
    error
  });

  // Check if it's a localStorage quota error
  if (message?.toString().includes('QuotaExceededError') ||
    message?.toString().includes('quota')) {
    console.warn('[Global Error Handler] localStorage quota exceeded, clearing...');
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error('[Global Error Handler] Failed to clear storage:', e);
    }
  }

  return false; // Let the error propagate to ErrorBoundary
};

// Handle unhandled promise rejections
window.onunhandledrejection = function (event) {
  console.error('[Unhandled Promise Rejection]', event.reason);

  // Check for storage errors
  if (event.reason?.message?.includes('QuotaExceededError') ||
    event.reason?.message?.includes('quota')) {
    console.warn('[Unhandled Rejection] localStorage quota exceeded, clearing...');
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error('[Unhandled Rejection] Failed to clear storage:', e);
    }
  }

  return false;
};

// Wrap localStorage operations with error handling
const originalSetItem = localStorage.setItem;
localStorage.setItem = function (key: string, value: string) {
  try {
    originalSetItem.call(localStorage, key, value);
  } catch (e: any) {
    console.error('[localStorage] Error setting item:', key, e);
    if (e.name === 'QuotaExceededError') {
      console.warn('[localStorage] Quota exceeded, attempting to clear old data...');
      try {
        // Try to clear non-essential data first
        const keysToKeep = ['token', 'sb-', 'supabase'];
        Object.keys(localStorage).forEach(k => {
          if (!keysToKeep.some(prefix => k.startsWith(prefix))) {
            localStorage.removeItem(k);
          }
        });
        // Try again
        originalSetItem.call(localStorage, key, value);
      } catch (retryError) {
        console.error('[localStorage] Failed to recover from quota error:', retryError);
        // Last resort: clear everything
        localStorage.clear();
        throw retryError;
      }
    } else {
      throw e;
    }
  }
};

// ==========================================
// EXISTING CODE
// ==========================================

// this is to fix the console warning it was due to spline robot trying to throw a warning to browser that it needs to check user moovement and it should not scroll but this function filters that 
const defaultAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options) {
  if (type === 'wheel' || type === 'touchmove' || type === 'touchstart') {
    // If Spline asks to block the scroll, we say No, keep scrolling smooth passive: true
    if (typeof options === 'object' && options) {
      (options as any).passive = true;
    } else {
      options = { passive: true } as any;
    }
  }
  // Call the original browser function
  defaultAddEventListener.call(this, type, listener, options);
};

// Prevent caching by adding cache-busting query parameter
if ("caches" in window) {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      caches.delete(cacheName);
    });
  });
}

// Force reload if there's a new version
window.addEventListener("load", () => {
  fetch(window.location.href, {
    cache: "no-store",
  }).then((response) => {
    if (response.headers.get("content-type")?.includes("text/html")) {
      response.text().then((html) => {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, "text/html");
        const newVersion = newDoc.querySelector('meta[name="version"]')?.getAttribute("content");
        const currentVersion = document.querySelector('meta[name="version"]')?.getAttribute("content");

        // Force reload if version changed
        if (newVersion && currentVersion && newVersion !== currentVersion) {
          window.location.reload();
        }
      });
    }
  });
});

createRoot(document.getElementById("root")!).render(<App />);


