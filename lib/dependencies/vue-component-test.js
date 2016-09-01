const webpack = require('webpack'),
      webpackDevServer = require('webpack-dev-server');

const vueComponentTest = (uiPath, webpackConfig, port) => {

    var compiler = webpack(webpackConfig),
        server = new webpackDevServer(compiler, serverConfig);

    server.listen(port, "localhost", function() {});
}
