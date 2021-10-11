import React, { useMemo } from 'react';

import CountLinks from '../../components/CountLinks';

const useCountLinks = ({ total, available }) => {
	const countLinks = useMemo(() => {
		return <CountLinks total={total} notCompleted={available} />;
	}, [available, total]);

	return { countLinks };
};

export default useCountLinks;
