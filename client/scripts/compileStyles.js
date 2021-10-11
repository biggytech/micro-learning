const sass = require('sass'),
	path = require('path'),
	fs = require('fs/promises'),
	colors = require('../src/styles/colors.json'),
	autoprefixer = require('autoprefixer'),
	postcss = require('postcss');

const stylesPath = '../src/styles/styles.scss',
	colorsFilePath = '../src/styles/_colors.scss',
	outputPath = '../dist/styles.css';

compileStyles();

async function compileStyles() {
	await createTempColorsFile();

	const outFile = path.resolve(__dirname, outputPath);

	const css = sass
		.renderSync({
			file: path.resolve(__dirname, stylesPath),
			outFile, // needed to get source map working, but we generate outFile by ourselfs
			sourceMap: !!+process.env.IS_DEV,
			outputStyle: 'compressed',
			sourceMapEmbed: true,
		})
		.css.toString();

	const autoprefixedCss = (await postcss([autoprefixer]).process(css)).css;

	await fs.appendFile(outFile, autoprefixedCss, {
		encoding: 'utf-8',
		flag: 'w',
	});

	await removeTempColorsFile();
}

async function createTempColorsFile() {
	let content = '';
	for (const colorName in colors) {
		content += `$${colorName}: ${colors[colorName]};\n`;
	}

	await fs.appendFile(path.resolve(__dirname, colorsFilePath), content, {
		encoding: 'utf-8',
		flag: 'w',
	});
}

async function removeTempColorsFile() {
	await fs.unlink(path.resolve(__dirname, colorsFilePath));
}
