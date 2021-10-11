import assets from '../assets.json';
import automaticCacheAssetsList from '../auto_cacheAssetsList.json';

const appShellCacheName = 'app-shell-v1',
	appShellFiles = [
		...automaticCacheAssetsList.map((url) => ({ url, cors: false })),
		{
			url: '/main.js',
			cors: false,
		},
		{
			url: '/styles.css',
			cors: false,
		},

		{
			url: '/manifest.json',
			cors: false,
		},
		...assets.fonts.map(({ url }) => ({ url, cors: true })),
	];

const cache = {
	async cacheAppShell() {
		const urls = [
			'/',
			...appShellFiles.map(({ url, cors }) => {
				if (!cors) return `.${url}`;
				return url;
			}),
		];
		const cache = await caches.open(appShellCacheName);
		await cache.addAll(urls);
	},
	getCacheOrNetwork(request) {
		return caches.open(appShellCacheName).then((cache) =>
			cache.match(request).then(
				(response) =>
					response ||
					fetch(request)
						.then((response) => {
							if (response.status === 404) {
								return cache.match('./404.html');
							}
							cache.put(request, response.clone());
							return response;
						})
						.catch(() => {
							return cache.match('./offline.html');
						}),
			),
		);
	},
	async clearCache() {
		const cacheNames = await caches.keys();
		return Promise.all(
			cacheNames
				.filter(() => false)
				.map((cacheName) => caches.delete(cacheName)),
		);
	},
	async isAppShellLoaded(origin) {
		if (caches && caches.open) {
			const cache = await caches.open(appShellCacheName);
			const keys = (await cache.keys()).map(({ url }) => url);

			for (const file of appShellFiles) {
				let url;
				if (file.cors) {
					url = file.url;
				} else {
					url = origin + file.url;
				}

				if (!keys.includes(url)) {
					return false;
				}
			}

			return true;
		} else {
			// reduced functionality, no offline
			return false;
		}
	},
};

export default cache;
