var async = require('async'),
    path = require('path'),
    fs = require('fs-extra'),
    UglifyJS = require('uglify-js'),
    colors = require('colors');

module.exports = function (outputPath, outputName, inputFiles, callback) {
    async.map(
        inputFiles,
        (filePath, cb) => {
            //concat file
            fs.readFile(filePath, 'utf8', (err, data) => {
                if(err) {
                    cb(err);
                }else {
                    cb(null, data);
                }
            });
        },
        (err, result) => {
            if(err) {
                callback(err);
            }

            fs.outputFile(path.join(outputPath, outputName + '.js'), UglifyJS.minify(result, {fromString: true, warnings: true}).code, (err) => {
                if(err) {
                    callback(err);
                }
                console.log(colors.underline.grey('  %s is generated'), outputName + '.js');
                callback();
            });
        }
    );
}
