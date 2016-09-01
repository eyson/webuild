const buildCommon = require('./build-common'),
      getUiDemo = require('./get-ui-demo'),
      buildBundle = require('./build-bundle');

//webuild 命令执行
const operList = {
    package: buildCommon,
    ui: getUiDemo,
    bundle: buildBundle
};

module.exports = operList;
