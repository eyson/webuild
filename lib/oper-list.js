const buildPackage = require('./build-package'),
      getUiDemo = require('./get-ui-demo'),
      buildBundle = require('./build-bundle');

//webuild 命令执行
const operList = {
    package: buildPackage,//读取package文件
    ui: getUiDemo,//生成ui demo
    bundle: buildBundle//webpack打包文件
};

module.exports = operList;
