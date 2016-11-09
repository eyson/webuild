const path = require('path'),
      co = require('co'),
      resolvePackage = require('./dependencies/resolve-package'),
      findAssets = require('./dependencies/find-assets'),
      escapeRegExChars = require('./utils/escape-regex-chars');
      log = require('./log');

require('shelljs/global');

//读取package信息文件
const buildPackage = (config, argv) => {
    log.info('Start to read packages info...');

    var file = argv._[1] || (argv._[0] && argv._[0] !== 'package' ? argv._[0] : null),
        spinner;

    co(function* () {
        const srcPath = config.srcPath,
              packageRegExp = new RegExp(escapeRegExChars(config.package));

        var packageJsons = [];

        if(file) {
            //build single specific file
            if(!packageRegExp.test(file)) {
                file += path.sep + config.package;
            }
            var packagePath = path.join(srcPath, file),
                packageAbsoutePath = path.join(process.cwd(), packagePath);

            if(!test('-f', packageAbsoutePath)) {
                return {
                    err: 'can\'t find file ' + packagePath
                }
            }else {
                packageJsons.push(packageAbsoutePath);
            }

        }else {
            packageJsons = yield findAssets(path.join(process.cwd(), srcPath), new RegExp(escapeRegExChars(config.package)));
        }

        var resolveList = [];

        packageJsons.forEach((file) => {
            resolveList.push(resolvePackage(file, config));
        });

        yield resolveList;

    }).then((result) => {
        if(result && result.err) {
            log.error(result.err);
        }else {
            log.success('Finish building!');
        }
    }, (err) => {
        log.error(err.stack);
    }).catch((err) => {
        log.error(err.stack);
    });
}

module.exports = buildPackage;
