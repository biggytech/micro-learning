const stores = {
	LINKS: {
		name: 'links',
		keyPath: 'key',
		indexes: {
			completed: {
				name: 'completed',
				property: 'completed',
				options: { unique: false },
			},
			url: {
				name: 'url',
				property: 'url',
				options: { unique: true },
			},
		},
	},
	SETTINGS: {
		name: 'settings',
		keyPath: 'key',
		indexes: {},
	},
};

export default stores;
