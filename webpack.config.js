const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const commonConfig = {
  entry: './src/js/swn.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'swn.css'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'SWN',
      type: 'umd',
      export: 'default',
      umdNamedDefine: true
    },
    globalObject: 'this'
  }
};

module.exports = [
  {
    ...commonConfig,
    mode: 'development',
    output: {
      ...commonConfig.output,
      filename: 'swn.js',
    },
    devtool: 'source-map',
    optimization: {
      minimize: false,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'swn.css'
      })
    ]
  },
  {
    ...commonConfig,
    mode: 'production',
    output: {
      ...commonConfig.output,
      filename: 'swn.min.js',
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            }
          },
        }),
        new CssMinimizerPlugin(),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'swn.min.css'
      })
    ]
  }
];