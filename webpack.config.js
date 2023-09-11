/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
const resolve = require('path').resolve;
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');

/**
 * Common configuration across all environments.
 */
const commonConfig = {
  entry: resolve(__dirname, 'main.js'),
  output: {
    filename: 'common-logging.min.js',
    library: {
      name: 'common-logging',
      type: 'umd',
    },
    globalObject: 'this',
  },
  devtool: 'source-map',
  mode: 'production',
  stats: 'summary',
  target: ['web', 'es5'],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_debugger: true,
            drop_console: false,
          },
        },
      }),
    ],
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        resolve(__dirname, 'main.js'),
        resolve(__dirname, 'src'),
      ],
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        babelrc: false,         // replace .babelrc with babel.config.json
        rootMode: 'upward',
      },
    }],
  },
};

/**
 * Module analysis configuration.
 */
const analyzerConfig = {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
};

module.exports = (process.env.USE_ANALYZER ? merge(commonConfig, analyzerConfig) : commonConfig);
