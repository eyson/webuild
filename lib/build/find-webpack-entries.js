var path = require('path'),
    find = require('find');

function findWebpackEntries(reg, root, srcFolder) {
    
    return new Promise((resolve, reject) => {
        find.file(reg, root, (files, err) => {
            var entry = {};

            if(err) reject(err);

            files.forEach((file) => {
                var name = file.split(srcFolder + path.sep)[1].replace(/(\.js|\.jsx)/, '');
                entry[name] = file;
            });

            resolve(entry);
        })
    })
}

module.exports = findWebpackEntries;
