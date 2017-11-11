var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

module.exports = {
  type: 'web-app',
  webpack: {
    publicPath: 'assets',
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
