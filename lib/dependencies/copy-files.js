/**
 * escape regular expression char with '\'
 * @param
 *   @root {String} source directer to be copied
 *   @output {Object} {version: String}
 *   @distPath {String} target directer to put copied files
 *   @ignoreFiles {Array}
 * @return {Undefined}
 */
const path = require('path'),
      async = require('async'),
      fs = require('fs-extra'),
      log = require('../log'),
      getRelativePath = require('../utils/get-relative-path');

const copyAssets = (root, output, distPath, ignoreFiles) => {

    const ignoreLength = ignoreFiles ? ignoreFiles.length : 0,
          targetPath = path.join(distPath, output.version);

    return new Promise((resolve, reject) => {

        fs.copy(root, targetPath, (file)=> {
            var relativeFile = getRelativePath(file, root),
                isIgnored = false;

            for(var i = 0; i < ignoreLength; i++) {
                if(relativeFile.indexOf(ignoreFiles[i]) != -1) {
                    isIgnored = true;
                    break;
                }
            }
            if(isIgnored) return false;

            return true;
        },(err) => {
           if (err) reject(err)

           log.info('copied ' + getRelativePath(root) + ' to ' + getRelativePath(targetPath));

           resolve();
        })

    })
};

module.exports = copyAssets;
