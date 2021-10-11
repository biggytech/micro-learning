import React, { useMemo } from 'react';

import LinksSettings from '../../components/LinksSettings';

const useLinksSettings = ({ clearCompleted }) => {
	const linksSettings = useMemo(() => {
		return <LinksSettings onClearCompletedClick={clearCompleted} />;
	}, [clearCompleted]);

	return { linksSettings };
};

export default useLinksSettings;
