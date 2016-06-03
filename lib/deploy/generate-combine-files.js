var async = require('async'),
    combineFiles = require('./combine-files');
// @config: {
//     fileName: files[array]
// }
module.exports = function (config, dest) {
    var outputNames = Object.keys(config);

    return new Promise((resolve, reject) => {
        //foreach output
        async.each(
            outputNames,
            (fileName, callback) => {
                //concat file
                combineFiles(dest,fileName, config[fileName], callback);
            },
            (err) => {
                if(err) reject(err);
                resolve();
            }
        );
    })
}
