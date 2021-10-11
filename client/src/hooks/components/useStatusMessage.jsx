import React, { useMemo, useCallback, useState, useEffect } from 'react';

import StatusMessage from '../../components/StatusMessage';

const useStatusMessage = ({ initial }) => {
	const [message, setMessage] = useState(initial);

	useEffect(() => {
		setMessage(initial);
	}, [initial]);

	const statusMessage = useMemo(() => {
		return <StatusMessage {...message} />;
	}, [message]);

	const renderStatus = useCallback((value) => {
		setMessage(value);
	}, []);

	return { statusMessage, renderStatus };
};

export default useStatusMessage;
