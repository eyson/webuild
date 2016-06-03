// 查找 以-entry.js结尾的js文件
find.file(/-entry\.js$/, jsSrcPath, function(files) {
    var config = Object.create(webpackConfig),
        compiler;

    files.forEach((file, index) => {
        var name = file.split('static_src' + path.sep)[1].split('.js')[0];
        config.entry[name] = file;
    });

    console.log(`build project: ${buildConfig.projectName}`);

    switch (TARGET) {
        case 'dev':// develope mode
            Object.assign(config, {
                devtool: 'eval',
                debug: true,
                cache: true
            });

            compiler = webpack(config);

            console.log('[webpack:build-dev]  watching...');

            // run a watcher
            compiler.watch({
                aggregateTimeout: 300,
                poll: true
            }, function(err, stats) {
                handleResult(err, stats);
                console.log('changed, hinting...')
            });
            break;
        case 'prod'://production mode
            config.plugins = config.plugins.concat(
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin()
            );

            webpack(config, function(err, stats) {
                handleResult(err, stats);
            });
            break;
        case 'server'://start a server
            break;
    }
});

function handleResult(err, stats) {
    if(err) {
        console.error(err);
    }else {
        console.log(stats.toString({
            colors: true
        }));
    }
}
