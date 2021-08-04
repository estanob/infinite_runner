var path = require("path");

module.exports = {
  context: __dirname,
  entry: '/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname),
  },
  resolve: {
    extensions: ['js', '*'],
  },
};