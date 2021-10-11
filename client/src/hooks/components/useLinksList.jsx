import React, { useMemo, useCallback } from 'react';

import LinksList from '../../components/LinksList';

const useLinksList = ({ onError, links, remove, complete }) => {
	const handleLinkRemove = useCallback(
		async (key) => {
			try {
				await remove(key);
			} catch (err) {
				onError(err);
			}
		},
		[remove, onError],
	);

	const handleLinkComplete = useCallback(
		async (key) => {
			try {
				await complete(key);
			} catch (err) {
				onError(err);
			}
		},
		[complete, onError],
	);

	const linksList = useMemo(() => {
		return (
			<LinksList
				links={links}
				onRemove={handleLinkRemove}
				onComplete={handleLinkComplete}
			/>
		);
	}, [handleLinkComplete, handleLinkRemove, links]);

	return {
		linksList,
	};
};

export default useLinksList;
