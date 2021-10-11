import { useState, useEffect } from 'react';

const useOfflineStatus = ({ onChange }) => {
	const [isOffline, setIsOffline] = useState(!navigator.onLine);

	useEffect(() => {
		const onOnline = () => {
			setIsOffline(false);
		};
		const onOffline = () => {
			setIsOffline(true);
		};

		window.addEventListener('online', onOnline);
		window.addEventListener('offline', onOffline);

		return () => {
			window.removeEventListener(onOnline);
			window.removeEventListener(onOffline);
		};
	}, []);

	useEffect(() => {
		onChange(isOffline);
	}, [isOffline, onChange]);

	return isOffline;
};

export default useOfflineStatus;
