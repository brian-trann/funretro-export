const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { renderCsv } = require('./helpers');

const [ url, fileType ] = process.argv.slice(2);

if (!url) {
	throw 'Please provide a URL as the first argument.';
}

async function run() {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	await page.goto(url);
	await page.waitForSelector('.message-list');

	const boardTitle = await page.$eval('#board-name', (node) => node.innerText.trim());

	if (!boardTitle) {
		throw 'Board title does not exist. Please check if provided URL is correct.';
	}

	const newFilename = boardTitle.split(' ').join('');
	const categoryArr = [];
	const parsedObj = {
		title : newFilename,
		csv   : {},
		txt   : {}
	};
	parsedObj['txt']['string'] = boardTitle + '\n\n';

	const columns = await page.$$('.message-list');

	for (let i = 0; i < columns.length; i++) {
		const csvColumn = {};
		const columnTitle = await columns[i].$eval('.column-header', (node) => node.innerText.trim());
		const messages = await columns[i].$$('.message-main');
		if (messages.length) {
			parsedObj['txt']['string'] += columnTitle + '\n';

			csvColumn[columnTitle] = {
				columnTitle,
				messages    : []
			};
			categoryArr.push(csvColumn[columnTitle]);
		}

		for (let i = 0; i < messages.length; i++) {
			const messageText = await messages[i].$eval('.message-body .text', (node) => node.innerText.trim());
			const votes = await messages[i].$eval('.votes .vote-area span.show-vote-count', (node) =>
				node.innerText.trim()
			);
			parsedObj['txt']['string'] += `- ${messageText} (${votes})` + '\n';
			const parsedVote = parseInt(votes);

			if (parsedVote > 0) {
				csvColumn[columnTitle]['messages'].push(messageText);
			}
		}

		if (messages.length) {
			parsedObj['txt']['string'] += '\n';
		}
	}
	parsedObj['csv']['string'] = renderCsv(categoryArr);

	return parsedObj;
}

function writeToFile(fileType, data) {
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
}

function handleError(error) {
	console.error(error);
}

run().then((parsedObj) => writeToFile(fileType, parsedObj)).catch(handleError);
