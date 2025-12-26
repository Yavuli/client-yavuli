import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

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

