/**
 * cli.js
 * @author Eyson
 */
'use strict';

// CMD命令行工具
var Cli = module.exports = {};

// 系统模块
var path = require('path');

// 自定义模块
var In = require('./in.js');
var Load = require('./load.js');



Cli.name = 'eyson';

Cli.help = function(cmd, options){};

Cli.run = function(argv){
    var cmd = argv._ || [],
        config = Load.config();

    if(In.array(cmd, 'watch')){
        console.log(config);
    }else if(In.array(cmd, 'deploy')){
        console.log(config);
        var Deploy = require('./deploy.js');
        Deploy();
    }else if(In.array(cmd, 'build')){
        console.log(config);
        var Build = require('./build.js');
        Build();
    }else{
        console.log(Cli.name);
    }
};