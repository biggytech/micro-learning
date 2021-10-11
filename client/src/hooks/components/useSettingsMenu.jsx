import React, { useCallback } from 'react';

import SettingsMenuComponent from '../../components/SettingsMenu';

const useSettingsMenu = () => {
	const SettingsMenu = useCallback(({ children }) => {
		return <SettingsMenuComponent>{children}</SettingsMenuComponent>;
	}, []);

	return {
		SettingsMenu,
	};
};

export default useSettingsMenu;
