const chalk = require('chalk');
const logSuccess = (msg) => console.log(chalk.green('SUCCESS: ', msg));

module.exports = logSuccess;
