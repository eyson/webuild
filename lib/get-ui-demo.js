const path = require('path'),
      log = require('./log'),
      fs = require('fs-extra'),
      merge = require('webpack-merge'),
      webpack = require('webpack'),
      bundleFile = require('./dependencies/bundle-file');

require('shelljs/global');

const getUiDemo = (config, argv) => {
    const webpackConfigPath = path.join(process.cwd(), config.webpackUiConfig || 'webpack.ui.config.js'),
          uiDemoFolderName = config.uiDemo || 'demo',
          file = argv._[1];

    if(!config.uiPath) {
        log.error('can\'t find uiPath in webuild.config.js');
        return;
    }

    if(!file) {
        log.error('use the command like this: ' + 'webuild ui [path]');
        return;
    }

    if(!test('-f', webpackConfigPath)) {
        log.error('can\'t find webpack configuration for ui');
        return;
    }

    var webpackConfig = require(webpackConfigPath);

    const widgetPath = path.join(process.cwd(), config.uiPath, file),
          widgetDemo = path.join(widgetPath, uiDemoFolderName),
          widgetDemoDist = widgetDemo.replace(config.srcPath, config.distPath),
          file_split = file.split('/'),
          widgetFile = file_split[file_split.length - 1],
          widgetName = widgetFile.split('-').map((item, i) => {
                return item.replace(/\w/, ($1) => $1.toUpperCase());
          }).join('');

    //touch file index.html
    if(!test('-f', path.join(widgetDemo, 'index.html'))) {

        var demo_tpl = require('./config/ui-demo-html')({
            title: widgetFile + '-demo',
            widget: widgetFile,
            output: '/index.js'
        });

        fs.outputFileSync(path.join(widgetDemo, 'index.html'), demo_tpl);
    }

    //touch file index.js
    if(!test('-f', path.join(widgetDemo, 'index.js'))) {

        var demo_entry = require('./config/ui-demo-entry')(widgetName);

        fs.outputFileSync(path.join(widgetDemo, 'index.js'), demo_entry);
    }

    var mode;

    if(argv.d || argv.w || argv.p) {
        mode = argv.d ? 'dev' : (argv.w ? 'watch' : 'prod');
        webpackConfig = merge(webpackConfig, {
            entry: {
                index: path.join(widgetDemo, 'index.js'),
            },
            output: {
                path: widgetDemoDist
            }
        })

    }else {
        mode = 'server';

        webpackConfig = merge(webpackConfig, {
            entry: {
                index: [
                    'webpack-dev-server/client?http://localhost:9080/',
                    'webpack/hot/dev-server',
                    path.join(widgetDemo, 'index.js')
                ]
            },
            output: {
                path: widgetDemoDist
            },
            devServer: {
                hot: true,
                port: 9080
            }
        });
    }

    //start weback server
    bundleFile(webpackConfig, mode);

}

module.exports = getUiDemo;
