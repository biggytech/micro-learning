export const isBrowserSupported = () => {
	if (!('fetch' in window) || !('indexedDB' in window)) {
		return false;
	}

	return true;
};

export const connectServiceWorkers = () => {
	if ('serviceWorker' in navigator) {
		return new Promise((resolve, reject) => {
			navigator.serviceWorker
				.register('./serviceWorker.js')
				.then((registration) => {
					console.log(
						'Successfully added service worker, the scope is:',
						registration.scope,
					);
					resolve(registration);
				})
				.catch(reject);
		});
	} else {
		//reduced functionality, no offline
		return Promise.resolve(false);
	}
};

export const isPushSupported = () =>
	'Notification' in window && 'PushManager' in window;
