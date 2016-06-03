const path = require('path'),
      webpack = require('webpack'),
      load = require('./load'),
      findWebpackEntries = require('./build/find-webpack-entries'),
      generatorToPromise = require('./build/generator-to-promise'),
      config = load.config();

var webpackConfig = config.webpackConfig,
    webpackPromise = require('./build/webpack-promise');

// type = null || type ='dev' || type ='watch' || type = 'prod', also read from buildConfig.env
function* run(type) {
    var bundleConfig = Object.create(webpackConfig),
        entry = {};
    type = type || config.env;
    entry = yield findWebpackEntries(config.entryReg, path.resolve(process.cwd(), config.srcPath), config.srcFolder);

    bundleConfig.entry = bundleConfig.entry || {};
    Object.assign(bundleConfig.entry, entry);

    yield webpackPromise(bundleConfig, type);
}

module.exports = generatorToPromise(run);
