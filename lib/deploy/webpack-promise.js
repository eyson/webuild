var webpack = require('webpack');

function handle(err, stats) {
    if(err) {
        console.error(err);
    }else {
        console.log(stats.toString({
            colors: true
        }));
    }
}

module.exports = function(config, mode) {
    mode = mode || 'prod';
    switch (mode) {
        case 'dev':// develope mode
        case 'watch'://watch
            Object.assign(config, {
                devtool: 'eval',
                debug: true,
                cache: true
            });
            break;
        case 'prod'://production mode
            config.plugins = config.plugins || [];
            config.plugins = config.plugins.concat(
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin()
            );
            break;
        case 'server'://start a server
            break;
    }

    if(mode == 'watch') {
        compiler = webpack(config);

        console.log('[webpack:build-dev]  watching...');

        // run a watcher
        compiler.watch({
            aggregateTimeout: 300,
            poll: true
        }, function(err, stats) {
            handle(err, stats);
            console.log('changed, hinting...')
        });
        return ;
    }else if(mode == 'prod' || mode == 'dev'){
        return new Promise((resolve, reject) => {
            webpack(config, (err, stats) => {
                if(err) {
                    reject(err);
                }
                console.log(stats.toString({
                    colors: true
                }));
                resolve();
            })
        })
    }
}
