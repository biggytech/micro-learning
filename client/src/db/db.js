import stores from './stores';
const idb = require('../libraries/idb');

const DATABASE_NAME = 'micro-learning-app',
	DATABASE_VERSION = 1;

const { LINKS: LINKS_STORE, SETTINGS: SETTINGS_STORE } = stores;

const db = {
	dbPromise: null,
	async initialize() {
		this.dbPromise = idb.open(
			DATABASE_NAME,
			DATABASE_VERSION,
			(upgradeDb) => {
				if (!upgradeDb.objectStoreNames.contains(LINKS_STORE.name)) {
					const linksStore = upgradeDb.createObjectStore(
						LINKS_STORE.name,
						{
							keyPath: LINKS_STORE.keyPath,
							autoIncrement: true,
						},
					);
					for (const index of Object.values(LINKS_STORE.indexes)) {
						linksStore.createIndex(
							index.name,
							index.property,
							index.options,
						);
					}
				}
				if (!upgradeDb.objectStoreNames.contains(SETTINGS_STORE.name)) {
					upgradeDb.createObjectStore(SETTINGS_STORE.name, {
						keyPath: SETTINGS_STORE.keyPath,
					});
				}
			},
		);

		if (navigator.storage && navigator.storage.persist) {
			await navigator.storage.persist();
		}
	},
	async add(storeName, item) {
		return new Promise((resolve, reject) => {
			let tx, key;
			this.dbPromise
				.then((dbInstance) => {
					tx = dbInstance.transaction(storeName, 'readwrite');
					const store = tx.objectStore(storeName);
					return store.add(item);
				})
				.then((value) => {
					key = value;
					return tx.complete;
				})
				.then(() => resolve(key))
				.catch((e) => {
					tx.abort();
					reject(e);
				});
		});
	},
	async remove(storeName, key) {
		return new Promise((resolve, reject) => {
			let tx;
			this.dbPromise
				.then((dbInstance) => {
					tx = dbInstance.transaction(storeName, 'readwrite');
					const store = tx.objectStore(storeName);
					return store.delete(key);
				})
				.then(() => tx.complete)
				.then(resolve)
				.catch((e) => {
					tx.abort();
					reject(e);
				});
		});
	},
	async getAll(storeName) {
		return new Promise((resolve, reject) => {
			let tx;
			this.dbPromise
				.then((dbInstance) => {
					tx = dbInstance.transaction(storeName, 'readonly');
					const store = tx.objectStore(storeName);
					return store.getAll();
				})
				.then(resolve)
				.catch((e) => {
					tx.abort();
					reject(e);
				});
		});
	},
	async put(storeName, item) {
		return new Promise((resolve, reject) => {
			let tx;
			this.dbPromise
				.then((dbInstance) => {
					tx = dbInstance.transaction(storeName, 'readwrite');
					const store = tx.objectStore(storeName);
					return store.put(item);
				})
				.then(() => tx.complete)
				.then(resolve)
				.catch((e) => {
					tx.abort();
					reject(e);
				});
		});
	},
	async get(storeName, key) {
		return new Promise((resolve, reject) => {
			let tx;
			this.dbPromise
				.then((dbInstance) => {
					tx = dbInstance.transaction(storeName, 'readonly');
					const store = tx.objectStore(storeName);
					return store.get(key);
				})
				.then(resolve)
				.catch((e) => {
					tx.abort();
					reject(e);
				});
		});
	},
	async getIndex(storeName, indexName, indexValue) {
		return new Promise((resolve, reject) => {
			let tx;
			const response = [];
			this.dbPromise
				.then((dbInstance) => {
					tx = dbInstance.transaction(storeName, 'readonly');
					const store = tx.objectStore(storeName);
					const index = store.index(indexName);
					return index.openCursor(indexValue);
				})
				.then(function showRange(cursor) {
					if (!cursor) return;
					response.push(cursor.value);
					return cursor.continue().then(showRange);
				})
				.then(() => {
					resolve(response);
				})
				.catch((e) => {
					tx.abort();
					reject(e);
				});
		});
	},
};

export default db;
