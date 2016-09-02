const find = require('find');

const findAssets = (root, pattern) => {

    return new Promise((resolve, reject) => {

        find.file(pattern, root, (files) => {
            resolve(files);
        })
        .error((err) => {
            if(err) reject(err);
        })
    })
};

module.exports = findAssets;
