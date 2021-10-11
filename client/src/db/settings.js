import db from './db';
import stores from './stores';

const { SETTINGS: SETTINGS_STORE } = stores;

const KEY = 1;

const settigns = {
	async put(data) {
		const existingSettings = await settigns.get();

		await db.put(SETTINGS_STORE.name, {
			key: KEY,
			...existingSettings,
			...data,
		});
		return KEY;
	},
	async remove() {
		await db.remove(SETTINGS_STORE.name, KEY);
	},
	async get() {
		return await db.get(SETTINGS_STORE.name, KEY);
	},
};

export default settigns;
