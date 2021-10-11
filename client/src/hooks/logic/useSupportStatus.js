import { useCallback, useState } from 'react';

import { isPushSupported } from '../../utils';

const useSupportStatus = () => {
	const [supportStatus, setSupportStatus] = useState({
		push: isPushSupported(),
		offline: false,
	});

	const update = useCallback((value) => {
		setSupportStatus((state) => ({ ...state, ...value }));
	}, []);

	return { supportStatus, update };
};

export default useSupportStatus;
