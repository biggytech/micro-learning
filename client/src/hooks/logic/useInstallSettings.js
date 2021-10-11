import { useCallback, useRef, useEffect } from 'react';

const useInstallSettings = ({
	onInstallPrompt: onInstallPromptProp,
	onAppInstallRequested,
}) => {
	const deferredInstallPrompt = useRef(null);

	useEffect(() => {
		const onInstallPrompt = (event) => {
			event.preventDefault();
			deferredInstallPrompt.current = event;
			onInstallPromptProp();
		};

		window.addEventListener('beforeinstallprompt', onInstallPrompt);

		return () => {
			window.removeEventListener('beforeinstallprompt', onInstallPrompt);
		};
	}, [onInstallPromptProp]);

	const requestAppInstall = useCallback(async () => {
		if (deferredInstallPrompt.current) {
			onAppInstallRequested();
			deferredInstallPrompt.current.prompt();

			const choice = await deferredInstallPrompt.current.userChoice;
			if (choice.outcome === 'accepted') {
				console.log('User accepted install');
			} else {
				console.log('User dismissed install');
			}

			deferredInstallPrompt.current = null;
		}
	}, [onAppInstallRequested]);

	return { requestAppInstall };
};

export default useInstallSettings;
