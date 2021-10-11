const path = require('path');
const webpack = require('webpack');

module.exports = (env) => ({
	mode: env.prod ? 'production' : 'development',
	devtool: env.prod ? false : 'eval-source-map',
	entry: path.resolve(__dirname, './src/serviceWorker.js'),
	output: {
		filename: 'serviceWorker.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new webpack.DefinePlugin({
			PROD: env.prod,
		}),
	],
});
