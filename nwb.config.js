var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

module.exports = {
  type: 'web-app',
  webpack: {
    html: {
      filename: 'webpack.html'
    },
    extractText: {
      allChunks: true,
      filename: process.env.NODE_ENV === 'production' ? `[name].[contenthash:8].css` : '[name].css',
    },
    extra: {
      plugins: [
        new ChunkManifestPlugin({
          filename: 'manifest.json',
          manifestVariable: 'webpackManifest',
          inlineManifest: false,
        }),
      ],
    },
  },
};
