import { useCallback, useState, useEffect } from 'react';

import settingsDB from '../../db/settings';
import api from '../../api';
import { isPushSupported } from '../../utils';

const useNotificationsSettings = ({ registration, clientId, onError }) => {
	const [notificationPermission, setNotificationPermission] = useState(
		isPushSupported() ? Notification?.permission : '',
	);
	const [notificationsHour, setNotificationsHour] = useState(null);

	const requestNotificationPermissionIfNeeded = useCallback(() => {
		if (Notification?.permission !== 'denied') {
			return Notification?.requestPermission((status) =>
				setNotificationPermission(status),
			);
		}
	}, []);

	const saveSettings = useCallback(async () => {
		try {
			let sub = await registration.pushManager.getSubscription();
			if (!sub) {
				const keys = await api.getKeys();
				if (!keys) {
					throw new Error('No response');
				}
				sub = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: keys.publicKey,
				});
			}

			const settings = {
				clientId,
				notificationsHour,
				subscriptionEndpoint: sub.endpoint,
				timeZoneOffset: new Date().getTimezoneOffset(),
			};
			await settingsDB.put(settings);

			if (notificationsHour !== -1) {
				const currentDate = new Date();
				const prefferedNotificationsDate = new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate(),
					notificationsHour,
					0,
				);
				const notificationsHourUTC =
						prefferedNotificationsDate.getUTCHours(),
					notificationsMinuteUTC =
						prefferedNotificationsDate.getUTCMinutes();

				console.log(
					await api.saveSettings({
						clientId,
						subscription: JSON.stringify(sub.toJSON()),
						notificationsHourUTC,
						notificationsMinuteUTC,
						timeZoneOffset: new Date().getTimezoneOffset(),
					}),
				);
			} else {
				await api.deleteSettings({ clientId });
			}
		} catch (e) {
			if (e.message.indexOf('Failed to fetch') === -1) {
				onError(e);
			}
		}
	}, [registration, clientId, notificationsHour, onError]);

	const handleNotificationTimeSave = useCallback(async (time) => {
		await settingsDB.put({
			notificationsHour: time,
		});
		setNotificationsHour(time);
	}, []);

	const init = useCallback(async () => {
		const settings = await settingsDB.get();
		if (settings?.notificationsHour) {
			setNotificationsHour(settings.notificationsHour);
		} else {
			setNotificationsHour(-1);
		}
	}, []);

	useEffect(() => {
		if (registration && notificationPermission === 'granted' && clientId) {
			if (notificationsHour !== null) {
				saveSettings();
			}
		}
	}, [
		notificationsHour,
		registration,
		clientId,
		saveSettings,
		notificationPermission,
	]);

	return {
		notificationPermission,
		notificationsHour,
		requestNotificationPermissionIfNeeded,
		handleNotificationTimeSave,
		init,
	};
};

export default useNotificationsSettings;
