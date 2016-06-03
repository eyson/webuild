var path = require('path'),
    async = require('async'),
    fs = require('fs-extra');

module.exports = function (fromPath, toPaths, toFolder, callback) {
    async.each(
        toPaths,
        (toPath, cb) => {
            fs.copy(path.join(fromPath), path.resolve(toPath, toFolder), (err) => {
                if(err) cb(err);
                else cb();
            });
        },
        (err) => {
            if(err) {
                callback(err);
            }else {
                callback(null, 'Distribute files success!')
            }
        }
    )
}
