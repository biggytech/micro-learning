import { useState, useCallback } from 'react';

import linksDB from '../../db/links';

const useLinks = () => {
	const [links, setLinks] = useState([]);
	const [total, setTotal] = useState(0);

	const init = useCallback(async () => {
		const { links: data, total } = await linksDB.getAll();
		setLinks(data);
		setTotal(total);
	}, []);

	const remove = useCallback(async (key) => {
		await linksDB.remove(key);
		setLinks((state) => state.filter((link) => link.key !== key));
		setTotal((value) => value - 1);
	}, []);

	const complete = useCallback(async (key) => {
		await linksDB.complete(key);
		setLinks((state) => state.filter((link) => link.key !== key));
	}, []);

	const add = useCallback(async (value) => {
		const key = await linksDB.add(value);
		setLinks((state) =>
			state.concat({
				key,
				url: value,
			}),
		);
		setTotal((value) => value + 1);
	}, []);

	const clearCompleted = useCallback(async () => {
		await linksDB.clearCompleted();
		await init();
	}, [init]);

	return { init, links, total, remove, complete, add, clearCompleted };
};

export default useLinks;
