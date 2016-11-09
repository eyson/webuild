/**
 * add '?v=MD5hash' to linked static file path
 * @param
 *   @staticPaths {Array} where static files locate
 *   @sourceFilesPath {Array} where resolved files locate
 * @return {Undefined}
 */

const fs = require('fs-extra'),
      co = require('co'),
      async = require('async'),
      findAssets = require('./find-assets'),
      getAssetsHash = require('./get-assets-hash'),
      log = require('../log');

const assetsBumper = co.wrap(function* (staticPaths, sourceFilesPath) {

        //static assets with version map
        var assets = yield getAssetsHash(staticPaths);

        //files to be add version
        var sourceFiles = yield findAssets(sourceFilesPath.path, sourceFilesPath.rule || /\.(html|css)$/);

        async.each(
            sourceFiles,
            (file, callback) => {
                fs.readFile(file, (err, data) => {
                    if (err) {
                       return callback(err);
                    }

                    var content = data.toString();

                    content = content.replace(/\?v=.+"/g, '"');

                    // add version hash to asset URL
                    assets.forEach((asset) => {
                       content = content.replace(asset.raw, asset.data);
                    });

                    fs.outputFile(file, content, (err) => {
                       callback(err);
                    });
                });
            },
            (err) => {
                if (err) {
                  log.error('Asset version bumping stopped with error: ' + err);

                  return Promise.reject(err);
                }

                return Promise.resolve();
            }
        );
});

module.exports = assetsBumper;
