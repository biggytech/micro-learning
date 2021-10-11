import { useCallback, useState, useEffect, useRef } from 'react';

import settingsDB from '../../db/settings';
import api from '../../api';
import { isPushSupported } from '../../utils';

const useNotificationsSettings = ({ registration, clientId }) => {
	const isInitialized = useRef(false);

	const [notificationPermission, setNotificationPermission] = useState(
		isPushSupported() ? Notification?.permission : '',
	);
	const [notificationsHour, setNotificationsHour] = useState(-1);

	const requestNotificationPermissionIfNeeded = useCallback(() => {
		if (Notification?.permission !== 'denied') {
			return Notification?.requestPermission((status) =>
				setNotificationPermission(status),
			);
		}
	}, []);

	const saveSettings = useCallback(async () => {
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
	}, [registration, clientId, notificationsHour]);

	const handleNotificationTimeSave = useCallback(async (time) => {
		setNotificationsHour(time);
		await settingsDB.put({
			notificationsHour: time,
		});
	}, []);

	const init = useCallback(async () => {
		const settings = await settingsDB.get();
		isInitialized.current = true;
		if (settings?.notificationsHour) {
			setNotificationsHour(settings.notificationsHour);
		}
	}, []);

	useEffect(() => {
		if (
			registration &&
			notificationPermission === 'granted' &&
			clientId &&
			isInitialized.current
		) {
			saveSettings();
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
