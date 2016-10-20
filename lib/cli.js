/**
 * cli.js
 * @author Eyson
 */
const path = require('path'),
      program = require('commander'),
      log = require('./log'),
      operList = require('./oper-list'),
      defaultConfig = require('./config/webuild.config.default'),//默认配置
      Load = require('./load');

// CMD命令行工具
var Cli = module.exports = {};

Cli.name = 'eyson';

Cli.help = function(cmd, options){};

Cli.run = function(argv){

    //命令使用
    program
      .version('1.1.0')
      .usage('[command] [path] [options]')
      .option('-d', 'build in development mode, allow debug and cache')
      .option('-p', 'build in production mode, uglify js and bump assets with hash')
      .option('-w', 'build in wath mode, start a complier watcher')
      .option('-s', 'build in server mode, start a server, listening at port 9080 by default')
      .option('--port', 'when build in server mode, use this option to custom server port, replace default port: 9080')
      .parse(process.argv);

    var config = Load.config() || {},
        cmd = argv._[0] || (config && config.type);

    //无法识别构建命令
    if(!cmd) {
        log.error('"type" is undefined in webuild.config.js or no command you want webuild to execute');
        return;
    }

    if(operList[cmd]) {
        //argv._[1] path
        config = Object.assign({}, defaultConfig, config);

        operList[cmd](config, argv);
    }else {
        log.error('command "' + cmd + '" has not yet supported by webuild');
    }
};
