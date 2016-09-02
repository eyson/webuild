//return assets hash  raw and data map
const fs = require('fs-extra'),
      crypto = require('crypto'),
      async = require('async');

const assetsHash = (assets) => {
    return new Promise((resolve, reject) => {

        async.map(
            assets.files,
            (item, callback) => {
                fs.readFile(item, (err, content) => {

                    var data = assets.prefix ? item.replace(assets.path, assets.prefix) : item.slice(1);
                    // use file content string to calc version hash
                    callback(null, {
                        raw: data,
                        data: data + '?v=' + crypto.createHash('md5').update(content.toString(), 'utf8').digest('hex').slice(0, 7)
                    });
                });
            },
            (err, result) => {
                if (err) {
                  reject(err);
                }

                resolve(result);
            }
        );
    })
};

module.exports = assetsHash;
