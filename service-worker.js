/* 
   SELF-DESTRUCT SERVICE WORKER
   This file exists to clean up the accidental PWA installation.
   It will unregister itself and force a reload of the page.
*/

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        self.registration.unregister()
            .then(function() {
                return self.clients.matchAll();
            })
            .then(function(clients) {
                clients.forEach(client => {
                    if (client.url && 'navigate' in client) {
                        client.navigate(client.url);
                    }
                });
            })
    );
});
