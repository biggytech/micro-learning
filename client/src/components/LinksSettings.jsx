import React from 'react';
import PropTypes from 'prop-types';

const CLASS_NAME = 'settings';

const LinksSettings = (props) => {
	const { onClearCompletedClick } = props;

	return (
		<li className={`${CLASS_NAME}__item`}>
			<h3>Links</h3>
			<button
				className={`${CLASS_NAME}__button`}
				onClick={onClearCompletedClick}
			>
				Clear completed links
			</button>
		</li>
	);
};

LinksSettings.propTypes = {
	onClearCompletedClick: PropTypes.func.isRequired,
};

export default LinksSettings;
