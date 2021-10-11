import { useCallback, useState, useEffect } from 'react';

import cache from '../../cache';

export const CACHE_STATUSES = {
	PENDING: 'PENDING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
};

const useCacheStatus = ({ onChange }) => {
	const [status, setStatus] = useState(CACHE_STATUSES.PENDING);

	const checkCacheStatus = useCallback(async (attempt = 1) => {
		const maxAttempts = 24;

		if (attempt > maxAttempts) {
			setStatus(CACHE_STATUSES.ERROR);

			return;
		}

		const isSynced = await cache.isAppShellLoaded(window.location.origin);
		if (!isSynced) {
			setTimeout(() => checkCacheStatus(attempt + 1), 5000);
		} else {
			setStatus(CACHE_STATUSES.SUCCESS);
		}
	}, []);

	useEffect(() => {
		onChange(status);
	}, [onChange, status]);

	useEffect(() => {
		checkCacheStatus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return status;
};

export default useCacheStatus;
