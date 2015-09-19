var path = require('path');
  module.exports = {
    entry: './src/main.js',
    output: {
      path: __dirname + '/public/build',
      filename: 'neuralnetwork.js',
      publicPath: './public'
    },
    module: {
      loaders: [
        { test: path.join(__dirname, 'src'),
          loader: 'babel-loader' }
      ]
    }
  };
