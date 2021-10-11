import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

import imagemin from 'imagemin';
import imageminPng from 'imagemin-pngquant';

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = '../dist/images',
	imagesPath = path.resolve(__dirname, '../src/images');

prepareImages(imagesPath);

async function prepareImages(imagesPath) {
	const paths = (await getImagesPaths(imagesPath)).map((p) =>
		p.replace(/\\/g, '/'),
	);

	await imagemin(paths, {
		destination: path.resolve(__dirname, outputPath),
		plugins: [imageminPng()],
	});
}

async function getImagesPaths(imagesPath) {
	const files = await fs.readdir(imagesPath);
	let paths = [];

	for (const file of files) {
		const fullPath = path.resolve(imagesPath, file),
			stat = await fs.stat(fullPath);

		const isDir = stat.isDirectory();
		if (isDir) {
			paths = paths.concat(await getImagesPaths(fullPath));
		} else {
			paths.push(fullPath);
		}
	}

	return paths;
}
