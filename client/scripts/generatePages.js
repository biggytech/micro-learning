const fs = require('fs/promises'),
	path = require('path'),
	colors = require('../src/styles/colors.json'),
	assets = require('../assets.json');

const templatePath = '../template.html',
	outputPath = '../dist/';

const pages = [
	{
		name: 'index',
		title: 'Micro Learning',
		content: '',
		addScripts: true,
	},
	{
		name: 'offline',
		title: 'Micro Learning - Offline',
		content: `
            <main class="content content--centered">
                <p class="offline-message">
                    You're offline now and trying to use something that isn't available now :(
                    </br>
                    <a href="/index.html" class="go-back">Go Back</a>
                </p>
            </main>
        `,
		addScripts: false,
	},
	{
		name: '404',
		title: 'Micro Learning - Not Found',
		content: `
            <main class="content content--centered">
                <p class="offline-message">
                    Requested page wasn't found :(
                    </br>
                    <a href="/index.html" class="go-back">Go Back</a>
                </p>
            </main>
        `,
		addScripts: false,
	},
];

generatePages(pages);

async function generatePages(pages) {
	try {
		const template = await fs.readFile(
			path.resolve(__dirname, templatePath),
			'utf-8',
		);

		for (const pageDef of pages) {
			const pageContent = addAssets(
				addColors(addContent(template, pageDef)),
			);

			await fs.appendFile(
				path.resolve(__dirname, outputPath + `${pageDef.name}.html`),
				pageContent,
				{
					encoding: 'utf-8',
					flag: 'w',
				},
			);
		}
	} catch (err) {
		console.error(err);
	}
}

function addAssets(content) {
	return content.replace(
		'{{fonts}}',
		assets.fonts
			.map(({ url, htmlCode }) => {
				return htmlCode.replace('{{url}}', url);
			})
			.join(' '),
	);
}

function addContent(content, pageDef) {
	return content
		.replace('{{title}}', pageDef.title)
		.replace('{{content}}', pageDef.content)
		.replace(
			'{{scripts}}',
			pageDef.addScripts
				? `
            <script src="./main.js"></script>
        `
				: '',
		);
}

function addColors(content) {
	return content
		.replace(/{{color-font}}/g, colors.font)
		.replace(/{{color-main}}/g, colors.main);
}
