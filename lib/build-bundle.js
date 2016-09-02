const path = require('path'),
      co = require('co'),
      merge = require('webpack-merge'),
      findAssets = require('./dependencies/find-assets'),
      bundleFile = require('./dependencies/bundle-file'),
      assetsBumper = require('./dependencies/assets-bumper'),
      handleError = require('./handle-error'),
      logSuccess = require('./log-success');


const buildBundle = (config, argv) => {
    mode = 'dev';

    if(argv.p) {
        mode = 'prod';
    }else if(argv.s) {
        mode = 'server';
    }else if(argv.w) {
        mode = 'watch';
    }

    co(function* () {
        const srcPath = config.srcPath;
        var assetsJs = yield findAssets(path.join(process.cwd(), srcPath), /\.js$/),
            entryJs = {};

        if(config.ignore) {
            assetsJs.filter((item) => {
                return item.replace(path.join(process.cwd(), srcPath), '').indexOf(config.ignore) == -1;
            }).forEach((item) => {
                entryJs[item.replace(path.join(process.cwd(), srcPath) + '/', '').replace('.js', '')] = item;
                return entryJs;
            })
        }

        var webpackConfig = require(path.join(process.cwd(), config.webpackConfig));
        webpackConfig = merge(webpackConfig, {
            entry: entryJs
        })

        yield bundleFile(webpackConfig, mode);

        //assets bumper
        if(mode == 'prod') {
            //add hash
            yield assetsBumper(config.staticPaths, {
                path: config.distPath,
                rule: config.versionFiles || /\.html$/
            });

            logSuccess('finished bundle in the production mode');
        }

    }).then(() => {

    }, (err) => {
        handleError(err.stack);
    }).catch((err) => {
        handleError(err.stack);
    });
}

module.exports = buildBundle;
