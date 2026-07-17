const CACHE_NAME = "autoframe-studio-v1.0.0";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./js/autoframe.js",
    "./js/export.js"
];

// ===========================
// INSTALL
// ===========================

self.addEventListener("install", event => {

    console.log("Service Worker Install");

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => cache.addAll(APP_FILES))

    );

});

// ===========================
// ACTIVATE
// ===========================

self.addEventListener("activate", event => {

    console.log("Service Worker Activate");

    event.waitUntil(

        caches.keys()

        .then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){

                        console.log("Delete Cache:", key);

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

// ===========================
// FETCH
// ===========================

self.addEventListener("fetch", event => {

    if(event.request.method !== "GET"){

        return;

    }

    event.respondWith(

        caches.match(event.request)

        .then(cacheResponse => {

            if(cacheResponse){

                return cacheResponse;

            }

            return fetch(event.request)

            .then(networkResponse => {

                // Simpan hanya request yang berhasil
                if(
                    networkResponse &&
                    networkResponse.status === 200 &&
                    event.request.url.startsWith(self.location.origin)
                ){

                    const responseClone = networkResponse.clone();

                    caches.open(CACHE_NAME)

                    .then(cache => {

                        cache.put(event.request, responseClone);

                    });

                }

                return networkResponse;

            });

        })

        .catch(() => {

            // Jika offline dan tidak ada di cache
            return new Response(
                "Offline",
                {
                    status:503,
                    statusText:"Offline"
                }
            );

        })

    );

});
