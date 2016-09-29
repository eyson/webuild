const buildCommon = require('./build-common'),
      getUiDemo = require('./get-ui-demo'),
      buildBundle = require('./build-bundle');

//webuild 命令执行
const operList = {
    package: buildCommon,//读取package文件
    ui: getUiDemo,//生成ui demo
    bundle: buildBundle//webpack打包文件
};

module.exports = operList;
