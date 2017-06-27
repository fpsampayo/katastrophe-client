var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /(node_modules(?!\/ui.leaflet.webpack)|bower_components)/, loader: 'babel-loader?presets[]=es2015'},
      {test: /\.css$/, loader: "style-loader!css-loader" },
      {test: /\.png$/, loader: "url-loader?limit=100000" },
    ]
  },
  resolve: {
    // Leaflet image Alias resolutions
    alias: {
      './images/layers.png$': path.resolve(__dirname, './node_modules/leaflet/dist/images/layers.png'),
      './images/layers-2x.png$': path.resolve(__dirname, './node_modules/leaflet/dist/images/layers-2x.png'),
      './images/marker-icon.png$': path.resolve(__dirname, './node_modules/leaflet/dist/images/marker-icon.png'),
      './images/marker-icon-2x.png$': path.resolve(__dirname, './node_modules/leaflet/dist/images/marker-icon-2x.png'),
      './images/marker-shadow.png$': path.resolve(__dirname, './node_modules/leaflet/dist/images/marker-shadow.png')
    }
  }
};
