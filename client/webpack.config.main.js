const path = require('path');
const webpack = require('webpack');

module.exports = (env) => ({
	mode: env.prod ? 'production' : 'development',
	devtool: env.prod ? false : 'eval-source-map',
	entry: path.resolve(__dirname, './src/main.jsx'),
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new webpack.DefinePlugin({
			PROD: env.prod,
		}),
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						cacheCompression: false,
						envName: env.prod ? 'production' : 'development',
					},
				},
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
});
