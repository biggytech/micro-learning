import db from './db';
import stores from './stores';

const { LINKS: LINKS_STORE } = stores;

const DUPLICATE_LINK_ERROR_MESSAGE = `You've already added this link`;

const ERROR_MESSAGES_MAP = {
	[`Unable to add key to index 'url': at least one key does not satisfy the uniqueness requirements.`]:
		DUPLICATE_LINK_ERROR_MESSAGE,
	['A mutation operation in a transaction failed because a constraint was not satisfied.']:
		DUPLICATE_LINK_ERROR_MESSAGE,
};

const links = {
	async add(url) {
		try {
			const key = await db.add(LINKS_STORE.name, {
				url,
				completed: 0,
			});
			return key;
		} catch (e) {
			if (ERROR_MESSAGES_MAP[e.message]) {
				throw new Error(ERROR_MESSAGES_MAP[e.message]);
			}
			throw e;
		}
	},
	async remove(key) {
		await db.remove(LINKS_STORE.name, key);
	},
	async getAll() {
		const notCompletedLinks = await db.getIndex(
			LINKS_STORE.name,
			LINKS_STORE.indexes.completed.name,
			0,
		);
		const allLinks = await db.getAll(LINKS_STORE.name);
		return {
			links: notCompletedLinks,
			total: allLinks.length,
		};
	},
	async complete(key) {
		const link = await db.get(LINKS_STORE.name, key);
		link.completed = 1;
		await db.put(LINKS_STORE.name, link);
	},
	async clearCompleted() {
		const completed = await db.getIndex(
			LINKS_STORE.name,
			LINKS_STORE.indexes.completed.name,
			1,
		);
		await Promise.all(
			completed.map((link) => db.remove(LINKS_STORE.name, link.key)),
		);
	},
};

export default links;
