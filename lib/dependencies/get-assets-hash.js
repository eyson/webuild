/**
 * find static files and get their MD5hash
 * @param
 *   @staticPaths {Array} where static files locate
 * @return {Array} file and it's hash map
 */

const co = require('co'),
      async = require('async'),
      findAssets = require('./find-assets'),
      assetsHash = require('./assets-hash');

const getAssetsHash = (staticPaths) => {
    return new Promise((resolve, reject) => {

        async.map(
            staticPaths,
            (static, callback) => {
                co(function* () {
                    static.files = yield findAssets(static.path, static.rule || /\.(js|css|png|jpg|gif|jpeg|webp|svg|ttf|woff|eot)$/i);
                    return yield assetsHash(static);
                }).then((assets) => {
                    callback(null, assets);
                }, (err) => {
                    callback(err);
                })
            },
            (err, assets) => {
                if(err) reject(err);

                else {
                    var result = [];
                    assets.forEach((item) => {
                        result = result.concat(item);
                    })
                    resolve(result);
                }
            }
        )
    })
};

module.exports = getAssetsHash;
