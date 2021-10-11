import React, { useMemo, useCallback, useRef } from 'react';

import InstallSettings from '../../components/InstallSettings';
import useInstallSettingsLogic from '../logic/useInstallSettings';

const useInstallSettings = () => {
	const ref = useRef(null);

	const onInstallPrompt = useCallback(() => {
		ref.current?.enableInstallButton();
	}, []);

	const onAppInstallRequested = useCallback(() => {
		ref.current?.disableInstallButton();
	}, []);

	const { requestAppInstall } = useInstallSettingsLogic({
		onInstallPrompt,
		onAppInstallRequested,
	});

	const installSettings = useMemo(() => {
		return <InstallSettings onInstallClick={requestAppInstall} ref={ref} />;
	}, [requestAppInstall]);

	return { installSettings };
};

export default useInstallSettings;
