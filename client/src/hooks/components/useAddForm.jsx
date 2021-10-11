import React, { useMemo, useCallback, useRef } from 'react';

import AddForm from '../../components/AddForm';

const useAddForm = ({ add, onError, isHasError }) => {
	const ref = useRef(null);

	const handleLinkAdd = useCallback(
		async (value) => {
			try {
				await add(value);
				ref.current?.onFinishAdding();
				ref.current?.clearAndFocus();
			} catch (err) {
				onError(err);
				ref.current?.onFinishAdding();
			}
		},
		[add, onError],
	);

	const addForm = useMemo(() => {
		return (
			<AddForm onAdd={handleLinkAdd} ref={ref} isHasError={isHasError} />
		);
	}, [handleLinkAdd, isHasError]);

	return { addForm };
};

export default useAddForm;
