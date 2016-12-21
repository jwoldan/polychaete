const path = require('path');

module.exports = {
  context: __dirname,
  entry: './lib/polychaete.js',
  output: {
    path: path.join(__dirname, 'javascripts'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        }
      }
    ]
  },
  devtool: 'source-maps',
  externals: {
    "createjs": "createjs",
  },
};
