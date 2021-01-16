const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { renderCsv } = require('./helpers');
const minVotes = 1;
const [ url, fileType ] = process.argv.slice(2);

if (!url) throw 'Please provide a URL as the first argument.';

async function run() {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	await page.goto(url);
	await page.waitForSelector('.message-list');

	const boardTitle = await page.$eval('#board-name', (node) => node.innerText.trim());

	if (!boardTitle) throw 'Board title does not exist. Please check if provided URL is correct.';

	const newFilename = boardTitle.split(' ').join('');
	const categoryArr = [];
	const parsedObj = {
		title : newFilename,
		csv   : {},
		txt   : {}
	};
	parsedObj['txt']['string'] = boardTitle + '\n\n';

	const columns = await page.$$('.message-list');

	for (const j in columns) {
		const csvColumn = {};
		const columnTitle = await columns[j].$eval('.column-header', (node) => node.innerText.trim());
		const messages = await columns[j].$$('.message-main');

		parsedObj['txt']['string'] += columnTitle + '\n';
		parsedObj['txt']['string'] += '\n';

		csvColumn[columnTitle] = {
			columnTitle,
			messages    : []
		};
		categoryArr.push(csvColumn[columnTitle]);

		for (const i in messages) {
			const messageText = await messages[i].$eval('.message-body .text', (node) => node.innerText.trim());
			const votes = await messages[i].$eval('.votes .vote-area span.show-vote-count', (node) =>
				node.innerText.trim()
			);
			parsedObj['txt']['string'] += `- ${messageText} (${votes})` + '\n';

			const parsedVote = parseInt(votes);

			if (parsedVote >= minVotes) {
				csvColumn[columnTitle]['messages'].push(messageText);
			}
		}
	}
	parsedObj['csv']['string'] = renderCsv(categoryArr);

	return parsedObj;
}

const writeToFile = (fileType, data) => {
	const type = fileType || 'txt';
	const resolvedPath = path.resolve(`../${data['title']}.${type}`);
	fs.writeFile(resolvedPath, data[type]['string'], (error) => {
		if (error) {
			throw error;
		} else {
			console.log(`Successfully written to file at: ${resolvedPath}`);
		}
		process.exit();
	});
};

const handleError = (error) => console.log(error);

run().then((parsedObj) => writeToFile(fileType, parsedObj)).catch(handleError);
