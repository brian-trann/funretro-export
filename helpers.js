/**
 * renderCsv 
 * - Args: Array
 * - Returns: String
 */
const renderCsv = (arr) => {
	const columns = arr.map((el) => {
		return el['columnTitle'];
	});
	let csvString = columns.toString() + '\n';
	const maxDepth = arr
		.map((el) => {
			return el['messages'].length;
		})
		.reduce((curr, acc) => {
			return curr > acc ? curr : acc;
		});
	const csvBody = Array(columns.length).fill().map(() => Array(maxDepth));
	arr.forEach((el, i) => {
		el['messages'].forEach((message, j) => {
			csvBody[j][i] = message;
		});
	});
	csvBody.forEach((row) => {
		csvString += row + '\n';
	});

	return csvString;
};
/**
 * removeCommasInStr
 * @param {*} str: 
 * Returns: str
 */
const removeCommasInStr = (str) => str.replace(/,/g, '');

module.exports = { renderCsv, removeCommasInStr };
