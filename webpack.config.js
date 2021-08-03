var path = require("path");

module.exports = {
  context: __dirname,
  entry: '/src/index.js',
  output: {
    path: path.resolve(__dirname)
  },
  resolve: {
    extensions: ['js', '*'],
  },
};