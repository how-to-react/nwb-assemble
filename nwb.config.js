var ManifestPlugin = require('webpack-manifest-plugin');
// var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

module.exports = {
  type: 'web-app',
  webpack: {
    publicPath: 'assets',
    extra: {
      plugins: [
        new ManifestPlugin({
          filter: ({path}) => path.endsWith('.map') === false,
        }),
        // new ChunkManifestPlugin({
        //   filename: 'manifest.json',
        //   manifestVariable: 'webpackManifest',
        //   inlineManifest: false,
        // }),
      ],
    },
  },
};
