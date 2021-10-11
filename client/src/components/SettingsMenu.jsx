import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CLASS_NAME = 'settings';

const SettingsMenu = (props) => {
	const { children } = props;

	const [isOpen, setIsOpen] = useState(false);

	const toggleSettings = useCallback(() => {
		setIsOpen((value) => !value);
	}, []);

	return (
		<div className={CLASS_NAME}>
			<button
				className={`${CLASS_NAME}__button`}
				onClick={toggleSettings}
			>
				<i className="fas fa-cog"></i>
			</button>
			<ul
				className={classnames(`${CLASS_NAME}__list`, {
					[`${CLASS_NAME}__list--closed`]: !isOpen,
				})}
			>
				<div
					className={`${CLASS_NAME}__list-wrapper`}
					onClick={toggleSettings}
				/>
				{children}
			</ul>
		</div>
	);
};

SettingsMenu.propTypes = {
	children: PropTypes.node.isRequired,
};

SettingsMenu.defaultProps = {};

export default SettingsMenu;
