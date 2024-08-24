const webpack = require('webpack');

module.exports = function override(config) {
    // Disable source maps if they are causing issues or are not needed
    config.devtool = false; // or 'eval' for development environments

    // Provide fallbacks for Node.js core modules that Webpack 5 no longer includes by default
    config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        url: require.resolve('url/'),
        vm: require.resolve('vm-browserify'),
    };

    // Remove source-map-loader if it's causing issues
    config.module.rules = config.module.rules.filter(
        (rule) => !(rule.loader && rule.loader.includes('source-map-loader'))
    );

    // Optionally, you can add plugins if needed
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ]);

    return config;
};
