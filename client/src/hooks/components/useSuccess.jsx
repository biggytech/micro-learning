import React, { useState, useCallback, useMemo, useRef } from 'react';

import SuccessMessage from '../../components/SuccessMessage';

const useSuccess = () => {
	const timeoutSuccess = useRef(null);

	const [message, setMessage] = useState(null);

	const renderSuccess = useCallback((text) => {
		setMessage(text);
		if (timeoutSuccess.current) {
			clearTimeout(timeoutSuccess.current);
		}
		if (text) {
			timeoutSuccess.current = setTimeout(() => {
				setMessage(null);
				timeoutSuccess.current = null;
			}, 6000);
		}
	}, []);

	const successMessage = useMemo(() => {
		return message ? <SuccessMessage text={message} /> : null;
	}, [message]);

	return {
		successMessage,
		renderSuccess,
	};
};

export default useSuccess;
