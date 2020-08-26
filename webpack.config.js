const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    front: './src/front.ts',
    back: './src/back.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'front.html',
      excludeChunks: ['back'],
      template: './src/template.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'back.html',
      excludeChunks: ['front'],
      template: './src/template.html',
    }),
  ],
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.ts', '.js'],
  },
};
