const webpack = require('webpack'),
      merge = require('webpack-merge'),
      chalk = require('chalk'),
      log = require('../log');

const logStat = (stats) => {
    console.log(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }))
};

const bundleFile = (webpackConfig, mode, closeLog) => {

    mode = mode || 'dev';
    switch (mode) {
        case 'dev':// develope mode
        case 'watch'://watch build
            webpackConfig = merge({
                devtool: '#eval-source-map',
                debug: true,
                cache: true
            }, webpackConfig);
            break;
        case 'prod'://production mode
            webpackConfig = merge({
                devtool: false,
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': '"production"'
                    }),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    }),
                    new webpack.optimize.OccurenceOrderPlugin()
                ]
            }, webpackConfig);
            break;
        case 'server':
            webpackConfig = merge({
                devtool: '#eval-source-map',
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': '"development"'
                    }),
                    new webpack.HotModuleReplacementPlugin()
                ]
            }, webpackConfig)
            break;
    }

    if(mode == 'watch') {
        var compiler = webpack(webpackConfig);

        log.info('[webpack:build-dev]  watching...');

        // run a watcher
        compiler.watch({
            aggregateTimeout: 300,
            poll: true
        }, function(err, stats) {
            if(err) {
                log.error(err);
            }else {
                logStat(stats);
                log.info('changed, hinting...');
            }
        });
        return Promise.resolve();

    }else if(mode == 'prod' || mode == 'dev'){
        return new Promise((resolve, reject) => {
            webpack(webpackConfig, (err, stats) => {
                if(err) {
                    reject(err);
                }

                if(!closeLog) {
                    logStat(stats);
                }

                resolve();
            })
        })
    }else if(mode == 'server') {
        const webpackDevServer = require('webpack-dev-server');
        var compiler = webpack(webpackConfig);
        var server = new webpackDevServer(compiler, webpackConfig.devServer);

        server.listen(webpackConfig.devServer.port, 'localhost', (err) => {
            if(err) {
                log.error(er);
            }else {
                log.info('Listening at http://localhost:' + webpackConfig.devServer.port);
            }
        });

        return Promise.resolve();
    }
};

module.exports = bundleFile;
