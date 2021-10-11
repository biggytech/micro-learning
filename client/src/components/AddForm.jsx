import React, {
	useCallback,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
	useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CLASS_NAME = 'add-form';

const AddForm = forwardRef((props, ref) => {
	const { onAdd, isHasError } = props;

	const [value, setValue] = useState('');

	const inputRef = useRef(null);
	const buttonRef = useRef(null);

	useImperativeHandle(
		ref,
		() => ({
			clearAndFocus: () => {
				setValue('');
				inputRef.current?.focus();
			},
			onFinishAdding: () => {
				if (inputRef.current) {
					inputRef.current.disabled = false;
				}
				if (buttonRef.current) {
					buttonRef.current.disabled = false;
				}
			},
		}),
		[],
	);

	useEffect(() => {
		if (isHasError) {
			inputRef.current?.focus();
		}
	}, [isHasError]);

	const handleInput = useCallback((e) => {
		setValue(e.target.value);
	}, []);

	const handleSubmit = useCallback(
		(e) => {
			e.preventDefault();

			if (inputRef.current) {
				inputRef.current.disabled = true;
			}
			if (buttonRef.current) {
				buttonRef.current.disabled = true;
			}

			onAdd(value.match(/^https?:\/\//) ? value : `http://${value}`);
		},
		[onAdd, value],
	);

	return (
		<form className={CLASS_NAME} onSubmit={handleSubmit}>
			<button
				ref={buttonRef}
				className={`${CLASS_NAME}__button`}
				onClick={handleSubmit}
				disabled={!value}
			>
				Add
			</button>
			<input
				ref={inputRef}
				className={classnames(`${CLASS_NAME}__input`, {
					[`${CLASS_NAME}__input--error`]: isHasError,
				})}
				placeholder="Enter a link"
				required
				value={value}
				onInput={handleInput}
			/>
		</form>
	);
});

AddForm.displayName = 'AddForm';

AddForm.propTypes = {
	onAdd: PropTypes.func.isRequired,
	isHasError: PropTypes.bool.isRequired,
};

AddForm.defaultProps = {};

export default AddForm;
