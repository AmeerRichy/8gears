// public/sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { delay, title, body, tag } = event.data;
    
    // We use a simple timeout in the SW. 
    // Note: SWs can be terminated, but many browsers keep them for a while if a notification is pending.
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: tag || 'abandoned-cart',
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
    }, delay);
  }
});
