const fs = require('fs-extra'),
      co = require('co'),
      path = require('path'),
      merge = require('webpack-merge'),
      mergeFiles = require('./merge-files'),
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
        if(packageObj.type === 'merge') {

            packageObj.output.forEach((output) => {
                operList.push(mergeFiles(rootPath, output, distPath));
            })

        }else if(packageObj.type === 'copy') {
            //copy
            packageObj.output.forEach((output) => {
                operList.push(copyFiles(rootPath, output, distPath));
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

            return yield Promise.reject(err);
        }

        yield operList;

    }catch(err) {

        return yield Promise.reject(err);

    }
});

module.exports = resolvePackage;
