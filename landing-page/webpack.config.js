const path = require('path');
const webpack = require('webpack');
module.exports = {
  context: path.resolve(__dirname, './scripts'),
  entry: {
    app: './app.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
  ]
};

// var debug = process.env.NODE_ENV !== "production";
// var webpack = require('webpack');

// module.exports = {
//     context: __dirname,
//     devtool: debug ? "inline-sourcemap" : null,
//     entry: "./scripts/app.js",
//     output: {
//         path: __dirname + "/js",
//         filename: "build.min.js"
//     },
//     plugins: debug ? [] : [
//         new webpack.optimize.DedupePlugin(),
//         new webpack.optimize.OccurenceOrderPlugin(),
//         new webpack.optimize.UglifyJsPlugin({
//             mangle: false,
//             sourcemap: false
//         }),
//     ],
// };