/**
 * use webpack to build ui component
 */
const path = require('path'),
      log = require('./log'),
      fs = require('fs-extra'),
      merge = require('webpack-merge'),
      webpack = require('webpack'),
      bundleFile = require('./dependencies/bundle-file'),
      copyFiles = require('./dependencies/copy-files');

require('shelljs/global');

const getUiDemo = (config, argv) => {
    const webpackConfigPath = path.join(process.cwd(), config.webpackUiConfig || 'webpack.ui.config.js'),
          uiDemoFolderName = config.uiDemo,
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
          uiDist = config.uiPath.replace(config.srcPath, config.distPath),
          widgetDemoDist = path.join(process.cwd(), uiDist, file, uiDemoFolderName),
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

    var themePath = path.join(widgetPath, 'theme').replace(config.srcPath, config.distPath);

    // add symlink to ui sytle
    // if(test('-d', themePath) && !test('-d', path.join(widgetPath, 'theme'))) {
    //     fs.symlinkSync(themePath, path.join(widgetPath, 'theme'), 'dir');
    // }

    var mode;

    if(argv.d || argv.w || argv.p) {
        mode = argv.d ? 'dev' : (argv.w ? 'watch' : 'prod');

        fs.copySync(path.join(widgetDemo, 'index.html'), path.join(widgetDemoDist, 'index.html'));

        webpackConfig = merge(webpackConfig, {
            entry: {
                index: path.join(widgetDemo, 'index.js'),
            },
            output: {
                path: widgetDemoDist
            }
        });

    }else {
        //by default
        mode = 'server';

        var port = argv.port || 9080;

        webpackConfig = merge(webpackConfig, {
            entry: {
                index: [
                    'webpack-dev-server/client?http://localhost:'  + port + '/',
                    'webpack/hot/dev-server',
                    path.join(widgetDemo, 'index.js')
                ]
            },
            output: {
                path: widgetDemoDist
            },
            devServer: {
                contentBase: path.join(config.uiPath, file, uiDemoFolderName, '/'),
                hot: true,
                port: port,
                stats: {
                  colors: true,
                  chunks: false
                }
            }
        });
    }

    //start weback server
    bundleFile(webpackConfig, mode);

}

module.exports = getUiDemo;
