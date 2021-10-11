import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CLASS_NAME = 'count-links';

const CountLinks = (props) => {
	const { total, notCompleted } = props;

	return (
		<div
			className={classnames(CLASS_NAME, {
				[`${CLASS_NAME}__empty`]: total === 0 || notCompleted === 0,
			})}
		>
			{total === 0
				? 'Add links using the form above.'
				: notCompleted === 0
				? `You've read all links from your list.`
				: `${total - notCompleted}/${total}`}
		</div>
	);
};

CountLinks.propTypes = {
	total: PropTypes.number.isRequired,
	notCompleted: PropTypes.number.isRequired,
};

CountLinks.defaultProps = {};

export default CountLinks;
