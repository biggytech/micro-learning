import { useEffect } from 'react';

import { isBrowserSupported, connectServiceWorkers } from '../../utils';

const useServiceWorker = ({ onError, onInit }) => {
	useEffect(() => {
		if (isBrowserSupported()) {
			connectServiceWorkers()
				.then(async (registration) => {
					onInit(registration);
				})
				.catch(onError);
		} else {
			onError(
				new Error(
					"You browser isn't supported. Use the newest version of the Chrome/Mozilla.",
				),
			);
		}
	}, [onError, onInit]);
};

export default useServiceWorker;
