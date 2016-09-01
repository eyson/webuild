const path = require('path'),
    async = require('async'),
    fs = require('fs-extra');

const copyAssets = (root, output, distPath) => {

    return new Promise((resolve, reject) => {

        fs.copy(root, path.join(distPath, output.version), (file)=> {
            //ignore package.json
            if(/package\.json/.test(file)) return false;
            return true;
        },(err) => {
          if (err) reject(err)

          resolve();
        })

    })
};

module.exports = copyAssets;
