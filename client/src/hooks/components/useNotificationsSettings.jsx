import React, { useMemo } from 'react';

import NotificationsSettings from '../../components/NotificationsSettings.jsx';

const useNotificationsSettings = ({
	notificationPermission,
	notificationsHour,
	requestNotificationPermissionIfNeeded,
	handleNotificationTimeSave,
}) => {
	const notificationSettings = useMemo(() => {
		return (
			<NotificationsSettings
				onEnableClick={requestNotificationPermissionIfNeeded}
				notificationPermission={notificationPermission}
				onNotificationTimeSave={handleNotificationTimeSave}
				notificationsHour={notificationsHour}
			/>
		);
	}, [
		handleNotificationTimeSave,
		notificationPermission,
		notificationsHour,
		requestNotificationPermissionIfNeeded,
	]);

	return { notificationSettings };
};

export default useNotificationsSettings;
