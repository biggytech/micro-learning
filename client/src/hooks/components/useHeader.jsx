import React, { useCallback } from 'react';

import HeaderComponent from '../../components/Header';

const useHeader = () => {
	const Header = useCallback(({ children }) => {
		return <HeaderComponent>{children}</HeaderComponent>;
	}, []);

	return { Header };
};

export default useHeader;
