const path = require('path'),
      co = require('co'),
      resolvePackage = require('./dependencies/resolve-package'),
      findAssets = require('./dependencies/find-assets'),
      logSuccess = require('./log-success'),
      handleError = require('./handle-error');


const buildCommon = (config) => {

    co(function* () {
        const srcPath = config.srcPath,
              packageJsons = yield findAssets(path.join(process.cwd(), srcPath), /package\.json$/);

        var resolveList = [];

        packageJsons.forEach((file) => {
            resolveList.push(resolvePackage(file, config));
        });

        yield resolveList;

    }).then(() => {
        logSuccess('build success!')

    }, (err) => {
        handleError(err.stack);
    }).catch((err) => {
        handleError(err.stack);
    });
}

module.exports = buildCommon;
