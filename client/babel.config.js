module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
			},
		],
		'@babel/preset-react',
	],
	plugins: [
		'@babel/plugin-transform-runtime',
		'@babel/plugin-syntax-dynamic-import',
	],
	env: {
		production: {
			plugins: [
				[
					'tranform-react-remove-prop-types',
					{
						removeImport: true,
					},
				],
				'@babel/plugin-transform-react-constant-elements',
			],
		},
	},
};
