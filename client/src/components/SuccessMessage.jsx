import React from 'react';
import PropTypes from 'prop-types';

const CLASS_NAME = 'success-message';

const SuccessMessage = (props) => {
	const { text } = props;

	return (
		<div className={CLASS_NAME}>
			<p className={`${CLASS_NAME}__text`}>{text}</p>
		</div>
	);
};

SuccessMessage.propTypes = {
	text: PropTypes.string.isRequired,
};

SuccessMessage.defaultProps = {};

export default SuccessMessage;
