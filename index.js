const assetsBumper = require('./lib/dependencies/assets-bumper');

function Webuild(){
    this.name = 'webuild';
    this.version = '1.1.0'
}

Webuild.prototype = {
    assetsBumper: assetsBumper,
    run: function(cmd){
        console.log('Run: ' + cmd);
    }
};

module.exports = new Webuild();
