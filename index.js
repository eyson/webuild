'use strict';

function My(){
    this.name = 'Eyson';
}

My.version = '1.0.0';

My.prototype = {
    run: function(cmd){
        console.log('Run: ' + cmd);
    }
};

module.exports = new My();