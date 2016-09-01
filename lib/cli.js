/**
 * cli.js
 * @author Eyson
 */
const path = require('path'),
      program = require('commander'),
      handleError = require('./handle-error'),
      operList = require('./oper-list'),
      defaultConfig = require('./config/webuild.config.default'),
      Load = require('./load');

// CMD命令行工具
var Cli = module.exports = {};

Cli.name = 'eyson';

Cli.help = function(cmd, options){};

Cli.run = function(argv){

    program
      .version('0.0.1')
      .usage('[command] [path] [options]')
      .option('-d', 'development mode')
      .option('-p', 'production mode')
      .option('-w', 'wath mode')
      .option('-s', 'server mode')
      .parse(process.argv);

    var config = Load.config() || {},
        cmd = argv._[0] || (config && config.type);

    if(!cmd) {
        handleError('"type" is undefined in webuild.config.js or no command you want webuild to execute');
        return;
    }

    if(operList[cmd]) {
        //argv._[1] path
        config = Object.assign({}, defaultConfig, config);

        operList[cmd](config, argv);
    }else {
        handleError('command "' + cmd + '" has not yet supported by webuild');
    }
};
