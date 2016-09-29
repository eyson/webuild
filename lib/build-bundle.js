const path = require('path'),
      co = require('co'),
      merge = require('webpack-merge'),
      findAssets = require('./dependencies/find-assets'),
      bundleFile = require('./dependencies/bundle-file'),
      assetsBumper = require('./dependencies/assets-bumper'),
      log = require('./log');

//读取项目工程入口js文件，并做模块解析处理打包等
//使用webpack
const buildBundle = (config, argv) => {
    var webpackConfig = require(path.join(process.cwd(), config.webpackConfig));

    var mode = 'dev',
        file = argv._[1] || (argv._[0] && argv._[0] !== 'bundle' ? argv._[0] : null);

    if(argv.p) {
        mode = 'prod';
    }else if(argv.s) {
        mode = 'server';
    }else if(argv.w) {
        mode = 'watch';
    }

    co(function* () {
        const srcPath = config.srcPath;
        var entryJs = {};

        if(file !== null) {
            log.info('start bundling "' + file + '"...');
            file = file.replace(/\.js/, '');
            entryJs[file] = path.resolve(process.cwd(), srcPath, file + '.js');
        }else {
            log.info('start bundling files in the project...')

            var assetsJs = yield findAssets(path.join(process.cwd(), srcPath), /\.js$/);

            //忽略文件
            if(config.ignore) {
                var assetsJs = assetsJs.filter((item) => {
                    return item.replace(path.join(process.cwd(), srcPath), '').indexOf(config.ignore) == -1;
                })
            }

            //处理webpack config entry参数
            assetsJs.forEach((item) => {
                entryJs[item.replace(path.join(process.cwd(), srcPath) + path.sep, '').replace('.js', '')] = item;
            })
        }

        //add hot-reload
        if(mode == 'server') {
            var port = argv.port || 9080;
            Object.keys(entryJs).forEach((entry) => {
                entryJs[entry] = [
                    'webpack-dev-server/client?http://localhost:' + port + '/',
                    'webpack/hot/dev-server'].concat(entryJs[entry]);
            })

            webpackConfig = merge(webpackConfig, {
                entry: entryJs,
                output: {
                    path: path.resolve(process.cwd(), webpackConfig.output.path)//webpack-dev-server will throw error when use 'htdocs'
                },
                devServer: {
                    hot: true,
                    port: port
                }
            });
        }else {
            webpackConfig = merge(webpackConfig, {
                entry: entryJs
            });
        }

        yield bundleFile(webpackConfig, mode);

        //assets bumper
        if(mode == 'prod' && config.addVersion) {
            //add hash
            yield assetsBumper(config.staticPaths, {
                path: config.distPath,
                rule: config.versionFiles || /\.html$/
            });
        }

    }).then(() => {
        if(mode == 'dev' || mode == 'prod') {
            log.success('finished bundle in the ' + mode + ' mode');
        }
    }, (err) => {
        log.error(err.stack);
    }).catch((err) => {
        log.error(err.stack);
    });
};

module.exports = buildBundle;
