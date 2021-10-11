import { useCallback, useState } from 'react';

const useRegistration = () => {
	const [registration, setRegistration] = useState(null);

	const update = useCallback((registration) => {
		let serviceWorker;
		if (registration?.installing) {
			serviceWorker = registration.installing;
		} else if (registration?.waiting) {
			serviceWorker = registration.waiting;
		} else if (registration?.active) {
			serviceWorker = registration.active;
		}

		if (serviceWorker) {
			if (serviceWorker.state == 'activated') {
				setRegistration(registration);
			} else {
				serviceWorker.addEventListener('statechange', (e) => {
					if (e.target.state == 'activated') {
						setRegistration(registration);
					}
				});
			}
		}
	}, []);

	return {
		registration,
		update,
	};
};

export default useRegistration;
