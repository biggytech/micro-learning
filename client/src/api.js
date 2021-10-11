const api = {
	getKeys: () => {
		return fetch('/api/keys').then((res) => res.json());
	},
	saveSettings: (data) => {
		return fetch('/api/settings', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((res) => res.json());
	},
	deleteSettings: (data) => {
		return fetch('/api/settings/delete', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	},
};

export default api;
