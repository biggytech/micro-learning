const path = require('path');
const fs = require('fs/promises');

generateCacheAssetsList();

async function generateCacheAssetsList() {
	let list = [];

	const imagesPath = path.resolve(__dirname, '../dist/images');
	const images = await fs.readdir(imagesPath);

	list = list.concat(images.map((imagePath) => `/images/${imagePath}`));

	const htmlsPath = path.resolve(__dirname, '../dist/');
	const htmls = (await fs.readdir(htmlsPath)).filter((path) =>
		/html$/.test(path),
	);

	list = list.concat(htmls.map((path) => `/${path}`));

	const assetsListTempFilePath = path.resolve(
		__dirname,
		'../auto_cacheAssetsList.json',
	);

	await fs.appendFile(assetsListTempFilePath, JSON.stringify(list), {
		encoding: 'utf-8',
		flag: 'w',
	});
}
