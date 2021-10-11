import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const CLASS_NAME = 'settings',
	DISPLAY_TIMES_TO_VALUES = new Map([
		['12am', 0],
		['1am', 1],
		['2am', 2],
		['3am', 3],
		['4am', 4],
		['5am', 5],
		['6am', 6],
		['7am', 7],
		['8am', 8],
		['9am', 9],
		['10am', 10],
		['11am', 11],
		['12pm', 12],
		['1pm', 13],
		['2pm', 14],
		['3pm', 15],
		['4pm', 16],
		['5pm', 17],
		['6pm', 18],
		['7pm', 19],
		['8pm', 20],
		['9pm', 21],
		['10pm', 22],
		['11pm', 23],
	]);

const NotificationsSettings = (props) => {
	const {
		onEnableClick,
		notificationPermission,
		onNotificationTimeSave,
		notificationsHour,
	} = props;

	const [selectedTime, setSelectedTime] = useState(-1);

	useEffect(() => {
		setSelectedTime(notificationsHour);
	}, [notificationsHour]);

	//region callbacks
	const handleTimeChange = useCallback((e) => {
		setSelectedTime(+e.target.value);
	}, []);

	const handleTimeSave = useCallback(() => {
		onNotificationTimeSave(selectedTime);
	}, [selectedTime, onNotificationTimeSave]);
	//endregion

	return (
		<li className={`${CLASS_NAME}__item`}>
			<h3>Notifications</h3>
			{notificationPermission === 'denied' && (
				<p>You&apos;ve denied push notifications.</p>
			)}
			{notificationPermission !== 'denied' &&
				notificationPermission !== 'granted' && (
					<button
						className={`${CLASS_NAME}__button`}
						onClick={onEnableClick}
					>
						Enable push notifications <i className="fas fa-bell" />
					</button>
				)}

			{notificationPermission === 'granted' && (
				<div className={`${CLASS_NAME}__notification`}>
					<label
						htmlFor="time-select"
						className={`${CLASS_NAME}__label`}
					>
						Select time of notifications:
					</label>
					<select
						name="notification-time"
						id="time-select"
						onChange={handleTimeChange}
						value={selectedTime}
						className={`${CLASS_NAME}__select`}
					>
						<option value={-1}>--- Not enabled ---</option>
						{Array.from(DISPLAY_TIMES_TO_VALUES).map(
							([time, value]) => (
								<option value={value} key={value}>
									{time}
								</option>
							),
						)}
					</select>
					<button
						className={`${CLASS_NAME}__button`}
						onClick={handleTimeSave}
					>
						Save changes
					</button>
				</div>
			)}
		</li>
	);
};

NotificationsSettings.propTypes = {
	onEnableClick: PropTypes.func.isRequired,
	notificationPermission: PropTypes.string,
	onNotificationTimeSave: PropTypes.func.isRequired,
	notificationsHour: PropTypes.number.isRequired,
};

NotificationsSettings.defaultProps = {
	notificationPermission: null,
};

export default NotificationsSettings;
