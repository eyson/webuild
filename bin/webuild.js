#!/usr/bin/env node

/**
 * eyson.js
 * @author Eyson
 */
'use strict';


var path = require('path');
var minimist = require('minimist');
var argv = minimist(process.argv.slice(2));

// CMD命令行工具
var Cli = __require('cli.js');
Cli.run(argv);


function __require(file){
    var s = '../lib/' + file;
    return require(path.join(__dirname, s));
}