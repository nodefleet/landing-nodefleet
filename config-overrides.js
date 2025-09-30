const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = function override(config, env) {
    // Agregar polyfills para InterchainJS
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "buffer": require.resolve("buffer/"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "assert": require.resolve("assert/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url/"),
        "vm": require.resolve("vm-browserify"),
        "fs": false,
        "net": false,
        "tls": false
    };

    // Agregar plugins para polyfills
    config.plugins.push(
        new (require('webpack')).ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        })
    );

    if (env === 'production') {
        // Aplicar ofuscación solo en producción
        config.plugins.push(
            new JavaScriptObfuscator({
                rotateStringArray: true,
                stringArray: true,
                stringArrayEncoding: ['base64'],
                stringArrayThreshold: 0.8,
                identifierNamesGenerator: 'hexadecimal',
                renameGlobals: false,
                selfDefending: true,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.4,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                debugProtection: true,
                debugProtectionInterval: 3000,
                disableConsoleOutput: true,
                unicodeEscapeSequence: true
            })
        );
    }

    return config;
}; 