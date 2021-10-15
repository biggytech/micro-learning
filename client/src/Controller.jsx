import React, { useState, useCallback } from 'react';

import db from './db';

import useLinks from './hooks/logic/useLinks';
import useNotificationsSettingsLogic from './hooks/logic/useNotificationsSettings';
import useClientId from './hooks/logic/useClientId';
import useRegistration from './hooks/logic/useRegistration';
import useCacheStatus, { CACHE_STATUSES } from './hooks/logic/useCacheStatus';
import useServiceWorker from './hooks/logic/useServiceWorker';
import useSupportStatus from './hooks/logic/useSupportStatus';

import useHeader from './hooks/components/useHeader';
import useError from './hooks/components/useError';
import useSuccess from './hooks/components/useSuccess';
import useLinksList from './hooks/components/useLinksList';
import useAddForm from './hooks/components/useAddForm';
import useCountLinks from './hooks/components/useCountLinks';
import useStatusMessage from './hooks/components/useStatusMessage';
import useSettingsMenu from './hooks/components/useSettingsMenu';
import useInstallSettings from './hooks/components/useInstallSettings';
import useNotificationsSettings from './hooks/components/useNotificationsSettings';
import useLinksSettings from './hooks/components/useLinksSettings';
import useOfflineStatus from './hooks/logic/useOfflineStatus';

const OFFLINE_STATUS_MESSAGE = {
		text: 'Offline',
		type: 'error',
	},
	INITIAL_STATUS_MESSAGE = {
		text: 'Syncing...',
	};

function Controller() {
	const [isReady, setIsReady] = useState(false);

	const { errorMessage: globalErrorMessage, renderError: renderGlobalError } =
		useError({ isGlobal: true });

	const handleLinkAdd = useCallback(
		async (value) => {
			clearMessages();
			await add(value);
			renderSuccess('Added!');
		},
		[add, clearMessages, renderSuccess],
	);

	const handleLinkRemove = useCallback(
		async (key) => {
			clearMessages();
			await remove(key);
			renderSuccess('Removed!');
		},
		[clearMessages, remove, renderSuccess],
	);

	const handleLinkComplete = useCallback(
		async (key) => {
			clearMessages();
			await complete(key);
			renderSuccess('Completed!');
		},
		[clearMessages, complete, renderSuccess],
	);

	const { registration, update: updateRegistration } = useRegistration();

	const handleServiceWorkerInit = useCallback(
		async (registration) => {
			updateSupportStatus({ offline: !!registration });

			if (!registration) {
				renderStatus({
					text: `Offline isn't supported`,
					type: 'error',
					status: 'done',
				});
			}

			await db.initialize();
			updateRegistration(registration);

			await initLinks();
			await initNotificationsSettings();
			await initClientId();

			setIsReady(true);
		},
		[
			initClientId,
			initLinks,
			initNotificationsSettings,
			renderStatus,
			updateRegistration,
			updateSupportStatus,
		],
	);

	const handleCacheStatusChange = useCallback(
		(status) => {
			switch (status) {
				case CACHE_STATUSES.PENDING:
					renderStatus({ text: 'Syncing...' });
					break;
				case CACHE_STATUSES.ERROR:
					renderStatus({
						text: `Couldn't sync`,
						type: 'error',
						status: 'done',
					});
					break;
				case CACHE_STATUSES.SUCCESS:
					renderStatus({
						text: 'Can work offline',
						type: 'success',
						status: 'done',
					});
					break;
			}
		},
		[renderStatus],
	);

	const {
		init: initLinks,
		links,
		total,
		remove,
		complete,
		add,
		clearCompleted,
	} = useLinks();
	const { init: initClientId, clientId } = useClientId();

	const {
		notificationPermission,
		notificationsHour,
		requestNotificationPermissionIfNeeded,
		handleNotificationTimeSave,
		init: initNotificationsSettings,
	} = useNotificationsSettingsLogic({
		registration,
		clientId,
		onError: renderError,
	});
	const cacheStatus = useCacheStatus({
		onChange: handleCacheStatusChange,
	});
	useServiceWorker({
		onError: renderGlobalError,
		onInit: handleServiceWorkerInit,
	});
	const { supportStatus, update: updateSupportStatus } = useSupportStatus();

	const { Header } = useHeader();
	const { errorMessage, renderError } = useError({ isSingle: true });

	const { successMessage, renderSuccess } = useSuccess();
	const { linksList } = useLinksList({
		links,
		remove: handleLinkRemove,
		complete: handleLinkComplete,
		onError: renderError,
	});
	const { addForm } = useAddForm({
		add: handleLinkAdd,
		onError: renderError,
		isHasError: !!errorMessage,
	});
	const { countLinks } = useCountLinks({ total, available: links.length });
	const { statusMessage, renderStatus } = useStatusMessage({
		initial: isOffline ? OFFLINE_STATUS_MESSAGE : INITIAL_STATUS_MESSAGE,
	});
	const { SettingsMenu } = useSettingsMenu();
	const { installSettings } = useInstallSettings();
	const { notificationSettings } = useNotificationsSettings({
		notificationPermission,
		notificationsHour,
		requestNotificationPermissionIfNeeded,
		handleNotificationTimeSave,
	});

	const { linksSettings } = useLinksSettings({ clearCompleted });

	const clearMessages = useCallback(() => {
		renderError(null);
		renderSuccess(null);
	}, [renderError, renderSuccess]);

	const handleOfflineStatusChange = useCallback(
		(isOffline) => {
			if (isOffline) {
				renderStatus(OFFLINE_STATUS_MESSAGE);
			} else {
				handleCacheStatusChange(cacheStatus);
			}
		},
		[renderStatus, cacheStatus, handleCacheStatusChange],
	);

	const isOffline = useOfflineStatus({
		onChange: handleOfflineStatusChange,
	});

	const isHasCompletedLinks = total > links.length;

	return (
		<>
			<Header>
				{statusMessage}
				{isReady && (
					<SettingsMenu>
						{supportStatus.offline && installSettings}
						{notificationsHour !== null &&
							supportStatus.push &&
							notificationSettings}
						{isHasCompletedLinks && linksSettings}
					</SettingsMenu>
				)}
			</Header>
			<main className="content">
				<section>
					{errorMessage}
					{successMessage}
				</section>
				<section>
					{globalErrorMessage}
					{!globalErrorMessage && isReady && (
						<>
							{addForm}
							{countLinks}
							{linksList}
						</>
					)}
				</section>
			</main>
		</>
	);
}

export default Controller;
