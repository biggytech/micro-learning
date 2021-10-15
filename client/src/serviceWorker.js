import cache from './cache';
import links from './db/links';
import db from './db';
import { NOTIFICATION_ACTIONS } from './constants';

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
			const link = data.links?.[0];

			if (link) {
				return await createNotification({
					title: 'Time to read a link!',
					data: link,
					body: `Link: ${link.url}`,
				});
			} else {
				return await createNotification({
					title: `It's time to add new links!`,
					body: `You'r links list is empty`,
					data: { reminder: true },
					addActions: false,
				});
			}
		})(),
	);
});

self.addEventListener('notificationclick', (e) => {
	const notification = e.notification;
	const action = e.action;

	if (action === NOTIFICATION_ACTIONS.COMPLETE.action) {
		e.waitUntil(
			(async () => {
				await db.initialize();
				await links.complete(notification.data.key);
				notification.close();
			})(),
		);
	} else if (action === NOTIFICATION_ACTIONS.CLEAR.action) {
		notification.close();
	} else {
		e.waitUntil(
			(async () => {
				if (!notification.data.reminder) {
					const url = notification.data.url;
					clients.openWindow(url);
					return await createNotification({
						title: `Don't forget to complete the link!`,
						data: { ...notification.data, reminder: true },
					});
				} else {
					const clis = await clients.matchAll();
					const client = clis.find((c) => {
						c.visibilityState === 'visible';
					});
					if (client !== undefined) {
						client.navigate(self.location.origin);
						client.focus();
					} else {
						// there are no visible windows. Open one.
						clients.openWindow(self.location.origin);
						notification.close();
					}
				}
			})(),
		);
	}
});

function createNotification({ title, data, body, addActions = true }) {
	const options = {
		icon: 'images/notification.png',
		tag: NOTIFICATIONS_GROUP_TAG,
		renotify: true,
		body,
		data,
	};
	if (
		addActions &&
		Notification &&
		'actions' in Notification.prototype &&
		Notification.maxActions
	) {
		switch (Notification.maxActions) {
			case 2:
				options.actions = [
					NOTIFICATION_ACTIONS.COMPLETE,
					NOTIFICATION_ACTIONS.CLEAR,
				];
				break;
			default:
				options.actions = [NOTIFICATION_ACTIONS.COMPLETE];
				break;
		}
	}

	return self.registration.showNotification(title, options);
}
