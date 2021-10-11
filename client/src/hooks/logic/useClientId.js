import { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';

import settingsDB from '../../db/settings';

const useClientId = () => {
	const [clientId, setClientId] = useState(null);

	const init = useCallback(async () => {
		const settings = await settingsDB.get();
		if (settings?.clientId) {
			setClientId(settings?.clientId);
		} else {
			const clientId = nanoid() + '-' + navigator.userAgent;
			await settingsDB.put({
				clientId,
			});
			setClientId(clientId);
		}
	}, []);

	return {
		init,
		clientId,
	};
};

export default useClientId;
