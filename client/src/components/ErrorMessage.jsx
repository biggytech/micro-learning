import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CLASS_NAME = 'error-message';

const ErrorMessage = (props) => {
	const { text, isGlobal, isSingle } = props;

	return (
		<p
			className={classnames(CLASS_NAME, {
				[`${CLASS_NAME}--global`]: isGlobal,
				[`${CLASS_NAME}--single`]: isSingle,
			})}
		>
			{text}
		</p>
	);
};

ErrorMessage.propTypes = {
	text: PropTypes.string.isRequired,
	isSingle: PropTypes.bool,
	isGlobal: PropTypes.bool,
};

ErrorMessage.defaultProps = {
	isSingle: false,
	isGlobal: false,
};

export default ErrorMessage;
