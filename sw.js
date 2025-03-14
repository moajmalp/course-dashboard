const CACHE_NAME = "codo-course-dashboard-v1";
const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/popup.js`"
];

const CACHE_VERSION = 'v1.2.3';

// Install Service Worker & Cache Files
self.addEventListener("install", (event) => {
    // Skip waiting to activate service worker immediately
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Cache each asset individually with proper error handling
                const cachePromises = STATIC_ASSETS.map(url => {
                    return fetch(url, { cache: 'no-cache' })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch ${url}`);
                            }
                            return cache.put(url, response);
                        })
                        .catch(error => {
                            console.warn(`Failed to cache ${url}:`, error);
                        });
                });
                return Promise.all(cachePromises);
            })
    );
});

// Activate Service Worker & Clean Old Caches
self.addEventListener("activate", (event) => {
    // Claim clients immediately
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            // Remove old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_VERSION) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Fetch Event Handler
self.addEventListener("fetch", (event) => {
    // Ignore WebSocket connections
    if (event.request.url.includes('/ws')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached response if found
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise try to fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Clone the response as it can only be consumed once
                        const responseToCache = response.clone();

                        // Cache the new resource
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return a fallback response for HTML requests
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        
                        // Return a simple offline message for other resources
                        return new Response(
                            'Offline content not available',
                            {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: new Headers({
                                    'Content-Type': 'text/plain'
                                })
                            }
                        );
                    });
            })
    );
});
