import cache from './cache';
import links from './db/links';
import db from './db';

const NOTIFICATIONS_GROUP_TAG = '1';

self.addEventListener('install', (event) => {
	// cache the app, static assets
	console.log('Server worker successfully installed');
	self.skipWaiting();
	event.waitUntil(cache.cacheAppShell());
});

self.addEventListener('activate', (event) => {
	// remove old cache
	// update caches
	console.log('Service worked successfully activated');
	event.waitUntil(
		(async () => {
			await cache.clearCache();
			await db.initialize();
		})(),
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.url.indexOf('http') !== 0) return; // skip the request. if request is not made with http protocol
	if (event.request.method !== 'GET') return;
	event.respondWith(cache.getCacheOrNetwork(event.request));
});

self.addEventListener('push', async (e) => {
	e.waitUntil(
		(async () => {
			await db.initialize();
			const data = await links.getAll();
			const link = data.links?.[0]?.url;

			if (link) {
				const options = {
					icon: 'images/notification.png',
					tag: NOTIFICATIONS_GROUP_TAG,
					renotify: true,
					body: `Link: ${link}`,
					data: {
						link,
					},
				};
				// Notification.maxActions

				return self.registration.showNotification(
					'You got new link to read!',
					options,
				);
			}
		})(),
	);
});

self.addEventListener('notificationclick', (e) => {
	const link = e.notification.data.link;

	clients.openWindow(link);
});
