var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  type: 'web-app',
  webpack: {
    publicPath: 'assets',
    extra: {
      plugins: [
        new ManifestPlugin({
          filter: ({path}) => path.endsWith('.map') === false,
        }),
      ],
    },
  },
};
