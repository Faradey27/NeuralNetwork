var path = require('path');
  module.exports = {
    entry: {
        test: './src/test.js',
        net: './src/net.js'
    },
    output: {
      path: __dirname + '/public/build',
      filename: '[name]neuralnetwork.js',
      publicPath: './public'
    },
    module: {
      loaders: [
        { test: path.join(__dirname, 'src'),
          loader: 'babel-loader' }
      ]
    }
  };
