// log relative infomation in the terminal
const chalk = require('chalk');

const log = {
    info: (msg) => {
        console.log(chalk.blue('INFO: ', msg));
    },
    success: (msg) => {
        console.log(chalk.green('SUCCESS: ', msg));
    },
    error: (msg) => {
        console.log(chalk.red('ERROR: ', chalk.underline(msg)));
    },
    warn: (msg) => {
        console.log(chalk.yellow('WARNING: ', msg));
    }
};

module.exports = log;
