import { useCallback, useState, useEffect } from 'react';

import settingsDB from '../../db/settings';
import api from '../../api';
import { isPushSupported } from '../../utils';

const useNotificationsSettings = ({
	registration,
	clientId,
	onError,
	onSave,
	isOffline,
}) => {
	const [isSaving, setIsSaving] = useState(false);
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
			setIsSaving(true);
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
			onSave('Synced to the server!');
		} catch (e) {
			if (isOffline || e.message.indexOf('Failed to fetch') !== -1) {
				onSave('Saved locally!');
			} else {
				onError(e);
			}
		} finally {
			setIsSaving(false);
		}
	}, [registration, clientId, notificationsHour, onError, onSave, isOffline]);

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
		isOffline,
	]);

	return {
		notificationPermission,
		notificationsHour,
		requestNotificationPermissionIfNeeded,
		handleNotificationTimeSave,
		init,
		isSaving,
	};
};

export default useNotificationsSettings;
