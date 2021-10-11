import React, { useState, useCallback, useMemo } from 'react';

import ErrorMessage from '../../components/ErrorMessage';

const useError = ({ isGlobal, isSingle }) => {
	const [error, setError] = useState(null);

	const errorMessage = useMemo(() => {
		return error ? (
			<ErrorMessage
				text={error.message}
				isSingle={isSingle}
				isGlobal={isGlobal}
			/>
		) : null;
	}, [error, isGlobal, isSingle]);

	const renderError = useCallback((error) => {
		if (!error) {
			return setError(null);
		}
		let text;
		if (PROD) {
			text = `Error: ${error.message}`;
		} else {
			text = `Error: ${error.message}\n${error.stack}`;
		}
		setError(new Error(text));
	}, []);

	return {
		errorMessage,
		renderError,
	};
};

export default useError;
