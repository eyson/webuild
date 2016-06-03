const path = require('path'),
      fs = require('fs-extra'),
      colors = require('colors'),
      load = require('./load'),
      generatorToPromise = require('./deploy/generator-to-promise'),
      webpackPromise = require('./deploy/webpack-promise'),
      generateCombineFiles = require('./deploy/generate-combine-files'),
      distributeFiles = require('./deploy/distribute-files'),
      config = load.config();

var webpackConfig = config.libs.bundle.config,
    combineLibsConfig = config.libs.combine,
    rootPath = process.cwd(),
    srcPath = path.resolve(rootPath, config.srcPath),
    distPath = path.resolve(rootPath, config.distPath),
    distributeDest = config.projects.map((projectName) => {
        return path.join(config.workspace, projectName);
    });

function handle(err, msg) {
    if(err) console.log(colors.error('Build stopped with error: '), err);
    else console.log(msg.green);
}
// type = null || type ='dev' || type =='watch'
function* run(type) {
    var bundleConfig = Object.create(webpackConfig);
    // debug webpack bundle
    if(type == 'dev' || type == 'watch') {
        console.log('Start debug webpack bundle...'.yellow);
        webpackPromise(bundleConfig, type);
        return;
    }
    console.log('Start use webpack to bundle modules...'.yellow);
    yield webpackPromise(bundleConfig, 'prod');
    console.log('Webpack bundle success!'.green);
    console.log('Start combine files...'.yellow);
    yield generateCombineFiles(combineLibsConfig, path.join(distPath, 'libs'));
    console.log('Combine files success!'.green);
    console.log('Start copy and distribute libs to projects...'.yellow)

    fs.copy(path.join(srcPath, 'mods'), path.join(distPath, 'mods'), (err) => {
        if(err) {
            console.error('Copy mods stopped with error:',  err);
        }
        console.log(distributeDest);
        distributeFiles(path.join(distPath, 'libs'), distributeDest, 'htdocs/res/libs', handle);
    });
}

module.exports = generatorToPromise(run);
