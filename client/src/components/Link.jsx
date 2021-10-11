import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const CLASS_NAME = 'link';

const Link = (props) => {
	const { url, id, onRemove, onComplete } = props;

	const handleComplete = useCallback(() => {
		onComplete(id);
	}, [onComplete, id]);

	const handleRemove = useCallback(() => {
		onRemove(id);
	}, [onRemove, id]);

	return (
		<li className={CLASS_NAME}>
			<a
				href={url}
				className={`${CLASS_NAME}__a`}
				target="_blank"
				rel="noreferrer"
			>
				{url}
			</a>
			<div className={`${CLASS_NAME}__buttons`}>
				<button
					className={`${CLASS_NAME}__button ${CLASS_NAME}__button_success`}
					title="Complete"
					onClick={handleComplete}
				>
					<i className="fas fa-check"></i>
				</button>
				<button
					className={`${CLASS_NAME}__button ${CLASS_NAME}__button_danger`}
					title="Remove"
					onClick={handleRemove}
				>
					<i className="fas fa-trash"></i>
				</button>
			</div>
		</li>
	);
};

Link.propTypes = {
	url: PropTypes.string.isRequired,
	id: PropTypes.number.isRequired,
	onRemove: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
};

Link.defaultProps = {};

export default Link;
