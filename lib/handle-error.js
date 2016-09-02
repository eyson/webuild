const chalk = require('chalk');
const handleError = (msg) => console.log(chalk.red('error: ', chalk.underline(msg)));

module.exports = handleError;
