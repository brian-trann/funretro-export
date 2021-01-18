const { renderCsv, removeCommasInStr } = require('./helpers');

// test('should render a string from an array of objects', () => {
// 	const result = renderCsv();
// });
describe('removeCommasInStr function', () => {
	test('removeCommasInStr should remove all commas in a string', () => {
		const strWithCommas = 'testing commas, commas, commas, and more commas';
		const emojisWithCommas = '😀, 😎, Testing emojis 😛, 😃,';

		expect(removeCommasInStr(strWithCommas)).not.toMatch(/,/g);
		expect(strWithCommas).toMatch(/,/g);
		expect(removeCommasInStr(emojisWithCommas)).not.toMatch(/,/g);
		expect(emojisWithCommas).toMatch(/,/g);
	});
	test('removeCommasInStr should not effect strings without commas', () => {
		const noCommas = 'testing a string with no commas!';
		const emptyStr = '';
		expect(removeCommasInStr(noCommas)).not.toMatch(/,/g);
		expect(removeCommasInStr(noCommas)).toMatch(noCommas);
		expect(removeCommasInStr(emptyStr)).not.toMatch(/,/g);
		expect(removeCommasInStr(emptyStr)).toMatch(emptyStr);
	});
});

describe('renderCsv function', () => {
	const testArr = [
		{
			columnTitle : 'Start',
			messages    : [
				'Mario - Hire our next team member based on an excellent interview and completion of the technical challenge.'
			]
		},
		{ columnTitle: 'Stop', messages: [] },
		{
			columnTitle : 'Continue',
			messages    : [
				'Tony - Conducting a survey of the team about each new hire around their 30th day.',
				'Lara - Using our technical challenge to identify the best candidates for our open opportunity.',
				'Spyro - Emphasizing to new hires how we use Slack by referring to our very short document in Confluence.'
			]
		}
	];
	const testArr2 = [
		{
			columnTitle : 'start',
			messages    : [ 'testing commas and commas and commas', '😀 😎 Testing emojis 😛 😃' ]
		},
		{
			columnTitle : 'stop',
			messages    : [ 'more commas            ', '!!!!!~~~~~~' ]
		},
		{ columnTitle: 'continue', messages: [ 'continue - test' ] }
	];
	test('should render a string from an array of objects', () => {
		const res = renderCsv(testArr);
		const res2 = renderCsv(testArr2);
		expect(typeof res).toBe('string');
		expect(typeof res2).toBe('string');
	});
	test('should render a string with a minimum number of commas, based on number of column title and total number of messages', () => {
		const res = renderCsv(testArr);
		const commaColumns = testArr.length - 1;
		const maxMessages = testArr
			.map((el) => {
				return el['messages'].length;
			})
			.reduce((curr, acc) => {
				return curr > acc ? curr : acc;
			});

		const totalCommas = res.match(/,/g || []).length;
		expect(totalCommas).toBeGreaterThan(maxMessages * commaColumns);

		const res2 = renderCsv(testArr2);
		const commaColumns2 = testArr2.length - 1;
		const maxMessages2 = testArr2
			.map((el) => el['messages'].length)
			.reduce((curr, acc) => (curr > acc ? curr : acc));
		const totalCommas2 = res2.match(/,/g || []).length;
		expect(totalCommas2).toBeGreaterThan(commaColumns2 * maxMessages2);
	});
});
