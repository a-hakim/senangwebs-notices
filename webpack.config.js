const path = require('node:path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

function config(filename, library, minified, cssFilename) {
  return {
    mode: 'production',
    entry: './src/js/swn.js',
    target: ['web', 'es2022'],
    experiments: { outputModule: library.type === 'module' },
    output: {
      path: path.resolve(__dirname, 'dist'), filename, library,
      globalObject: 'globalThis',
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { babelrc: false, presets: [['@babel/preset-env', { targets: { chrome: '120', firefox: '120', safari: '17' }, modules: false }]] } } },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      ],
    },
    plugins: [new MiniCssExtractPlugin({ filename: cssFilename })],
    devtool: minified ? false : 'source-map',
    optimization: {
      minimize: minified,
      minimizer: [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()],
    },
  };
}

module.exports = [
  config('swn.js', { name: 'SWN', type: 'umd', export: 'default', umdNamedDefine: true }, false, 'swn.css'),
  config('swn.min.js', { name: 'SWN', type: 'umd', export: 'default', umdNamedDefine: true }, true, 'swn.min.css'),
  config('swn.mjs', { type: 'module' }, false, 'swn.esm.css'),
  config('swn.cjs', { type: 'commonjs2', export: 'default' }, false, 'swn.cjs.css'),
];
