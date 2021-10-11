import React, { useMemo, useCallback, useState } from 'react';

import StatusMessage from '../../components/StatusMessage';

const useStatusMessage = ({ initial }) => {
	const [message, setMessage] = useState(initial);

	const statusMessage = useMemo(() => {
		return <StatusMessage {...message} />;
	}, [message]);

	const renderStatus = useCallback((value) => {
		setMessage(value);
	}, []);

	return { statusMessage, renderStatus };
};

export default useStatusMessage;
