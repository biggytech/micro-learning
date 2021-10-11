import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import colors from '../styles/colors.json';

const COLORS = {
		neutral: undefined,
		success: colors['success-light'],
		error: colors['error'],
	},
	CLASS_NAME = 'status-message';

const StatusMessage = ({ text, type, status }) => {
	return (
		<span
			className={classnames(CLASS_NAME, `${CLASS_NAME}--${status}`)}
			style={{ color: COLORS[type] }}
		>
			{text}
		</span>
	);
};

StatusMessage.propTypes = {
	text: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['neutral', 'success', 'error']),
	status: PropTypes.oneOf(['loading', 'done']),
};

StatusMessage.defaultProps = {
	type: 'neutral',
	status: 'loading',
};

export default StatusMessage;
