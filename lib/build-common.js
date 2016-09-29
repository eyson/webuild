const path = require('path'),
      co = require('co'),
      resolvePackage = require('./dependencies/resolve-package'),
      findAssets = require('./dependencies/find-assets'),
      log = require('./log');

//读取package信息文件
const buildCommon = (config) => {
    log.info('start to read packages info...');
    co(function* () {
        const srcPath = config.srcPath,
              packageJsons = yield findAssets(path.join(process.cwd(), srcPath), /package\.json$/);

        var resolveList = [];

        packageJsons.forEach((file) => {
            resolveList.push(resolvePackage(file, config));
        });

        yield resolveList;

    }).then(() => {
        log.success('finish building!');
    }, (err) => {
        log.error(err.stack);
    }).catch((err) => {
        log.error(err.stack);
    });
}

module.exports = buildCommon;
