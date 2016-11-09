const fs = require('fs-extra'),
      path = require('path'),
      async = require('async'),
      UglifyJS = require('uglify-js'),
      log = require('../log'),
      getRelativePath = require('../utils/get-relative-path');

const concatFiles = (root, output, distPath) => {

    var entryList = output.entry;

    return new Promise((resolve, reject) => {

        //resolve entry path
        entryList = entryList.map((entry) => path.join(root, entry));

        async.map(
            entryList,
            (entry, cb) => {
                //concat file
                fs.readFile(entry, 'utf8', (err, data) => {
                    if(err) {
                        cb(err);
                    }else {
                        cb(null, data);
                    }
                });
            },
            (err, result) => {
                if(err) {
                    reject(err);
                }

                var targetFile = path.join(distPath, output.version, output.name + '.js');
                //output file and uglify js file
                fs.outputFile(targetFile, UglifyJS.minify(result, {fromString: true, warnings: false}).code, (err) => {
                    if(err) {
                        reject(err);
                    }
                    log.info('got merged filed ' + getRelativePath(targetFile));

                    resolve();
                });
            }
        );
    })
};

module.exports = concatFiles;
