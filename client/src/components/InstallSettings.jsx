import React, { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';

const CLASS_NAME = 'settings';

const InstallSettings = forwardRef((props, ref) => {
	const { onInstallClick } = props;

	const [isInstallDisabled, setIsInstallDisabled] = useState(true);

	useImperativeHandle(
		ref,
		() => ({
			enableInstallButton: () => {
				setIsInstallDisabled(false);
			},
			disableInstallButton: () => {
				setIsInstallDisabled(true);
			},
		}),
		[],
	);

	return (
		<li className={`${CLASS_NAME}__item`}>
			<h3>Install app</h3>
			<button
				className={`${CLASS_NAME}__button`}
				disabled={isInstallDisabled}
				onClick={onInstallClick}
			>
				Install app <i className="fas fa-download" />
			</button>
		</li>
	);
});

InstallSettings.displayName = 'InstallSettings';

InstallSettings.propTypes = {
	onInstallClick: PropTypes.func.isRequired,
};

InstallSettings.defaultProps = {};

export default InstallSettings;
