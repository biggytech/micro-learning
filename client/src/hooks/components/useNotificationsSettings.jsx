import React, { useMemo } from 'react';

import NotificationsSettings from '../../components/NotificationsSettings.jsx';

const useNotificationsSettings = ({
	notificationPermission,
	notificationsHour,
	requestNotificationPermissionIfNeeded,
	handleNotificationTimeSave,
	isLoading,
}) => {
	const notificationSettings = useMemo(() => {
		return (
			<NotificationsSettings
				onEnableClick={requestNotificationPermissionIfNeeded}
				notificationPermission={notificationPermission}
				onNotificationTimeSave={handleNotificationTimeSave}
				notificationsHour={notificationsHour}
				isLoading={isLoading}
			/>
		);
	}, [
		handleNotificationTimeSave,
		notificationPermission,
		notificationsHour,
		requestNotificationPermissionIfNeeded,
		isLoading,
	]);

	return { notificationSettings };
};

export default useNotificationsSettings;
