import React from 'react';
import PropTypes from 'prop-types';

import Link from './Link.jsx';

const CLASS_NAME = 'links-list';

const LinksList = (props) => {
	const { links, onRemove, onComplete } = props;

	return (
		<ul className={CLASS_NAME}>
			{links.map(({ url, key }) => (
				<Link
					key={key}
					url={url}
					id={key}
					onRemove={onRemove}
					onComplete={onComplete}
				/>
			))}
		</ul>
	);
};

LinksList.propTypes = {
	links: PropTypes.array.isRequired,
	onRemove: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
};

LinksList.defaultProps = {};

export default LinksList;
