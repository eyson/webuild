/**
 * load.js
 * @author Eyson
 */
'use strict';

// 模块定义
var Load = module.exports = {};

// 加载系统模块
var path = require('path');

// 默认配置
Load.defaults = {
    config: {
        file: './webuild.config.js'
    }
};

Load.config = function(){
    var file = this.defaults.config.file;
    return require(path.join(process.cwd(), file));
};