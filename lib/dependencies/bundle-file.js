const webpack = require('webpack'),
      merge = require('webpack-merge'),
      chalk = require('chalk'),
      webpackDevServer = require('webpack-dev-server'),
      handleError = require('../handle-error');

const logStat = (stats) => {
    console.log(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }))
};

const bundleFile = (webpackConfig, mode) => {
    mode = mode || 'dev';
    switch (mode) {
        case 'dev':// develope mode
        case 'watch'://watch build
            Object.assign(webpackConfig, {
                devtool: 'eval',
                debug: true,
                cache: true
            });
            break;
        case 'prod'://production mode
            webpackConfig = merge(webpackConfig, {
                plugins: [
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin()
                ]
            })
            break;
        case 'server':
            webpackConfig = merge(webpackConfig, {
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': '"development"'
                    }),
                    new webpack.HotModuleReplacementPlugin()
                ]
            })
            break;
    }

    if(mode == 'watch') {
        var compiler = webpack(webpackConfig);

        console.log(chalk.blue('[webpack:build-dev]  watching...'));

        // run a watcher
        compiler.watch({
            aggregateTimeout: 300,
            poll: true
        }, function(err, stats) {
            if(err) {
                handleError(err);
            }else {
                logStat(stats);
                console.log('changed, hinting...');
            }
        });
        return Promise.resolve();

    }else if(mode == 'prod' || mode == 'dev'){
        return new Promise((resolve, reject) => {
            webpack(webpackConfig, (err, stats) => {
                if(err) {
                    reject(err);
                }
                logStat(stats);
                resolve();
            })
        })
    }else if(mode == 'server') {
        var compiler = webpack(webpackConfig);
        var server = new webpackDevServer(compiler, {
            stats: {
              colors: true,
              chunks: false
            }
        });
        server.listen(webpackConfig.devServer.port, 'localhost', () => {
            console.log(chalk.blue('Listening at http://localhost:' + webpackConfig.devServer.port));
        });

        return Promise.resolve();
    }
};

module.exports = bundleFile;