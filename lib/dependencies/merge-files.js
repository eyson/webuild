const fs = require('fs-extra'),
      path = require('path'),
      async = require('async'),
      UglifyJS = require('uglify-js');

const mergeFiles = (root, output, distPath) => {

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

                //output file and uglify js file
                fs.outputFile(path.join(distPath, output.version, output.name + '.js'), UglifyJS.minify(result, {fromString: true, warnings: true}).code, (err) => {
                    if(err) {
                        reject(err);
                    }
                    resolve();
                });
            }
        );
    })
};

module.exports = mergeFiles;
