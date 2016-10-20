const fs = require('fs-extra'),
      co = require('co'),
      path = require('path'),
      merge = require('webpack-merge'),
      concatFiles = require('./concat-files'),
      copyFiles = require('./copy-files'),
      bundleFile = require('./bundle-file'),
      webpackBasicConfig = require('../config/webpack.library.config');

const resolvePackage = co.wrap(function* (packageJson, config) {

    try {
        var packageObj = fs.readJsonSync(packageJson),
            operList = [],
            rootPath = path.dirname(packageJson),
            distPath = rootPath.replace(config.srcPath, config.distPath);

        //mergeFile
        if(packageObj.type === 'concat') {

            packageObj.output.forEach((output) => {
                operList.push(concatFiles(rootPath, output, distPath));
            })

        }else if(packageObj.type === 'copy') {
            packageObj.ignore = packageObj.ignore || [];
            //copy
            packageObj.output.forEach((output) => {
                var ignoreList = packageObj.ignore.concat(config.package);
                operList.push(copyFiles(rootPath, output, distPath, ignoreList));
            })

        }else if(packageObj.type === 'bundle') {
            //webpack resolve modules
            packageObj.output.forEach((output) => {
                var outputName = output.name || output.entry.replace(/\..*$/, ''),
                    webpackConfig = merge(webpackBasicConfig, {
                        output: {
                            path: path.join(distPath, output.version)
                        }
                    });

                webpackConfig.entry = {};
                webpackConfig.entry[outputName] = path.join(rootPath, output.entry);

                //default
                operList.push(bundleFile(webpackConfig, 'prod'));
            })
        }else {

            return yield Promise.reject('don\'t support' + packageObj.type);
        }

        yield operList;

    }catch(err) {
        return yield Promise.reject(err);
    }
});

module.exports = resolvePackage;
