var webpackConf = require('./webpack.config.js');

module.exports = function (config) {
    config.set(
        {
            reporters: ['progress'],
            port: 9876,  // karma web server port
            colors: true,
            logLevel: config.LOG_INFO,
            resolve: {
                extensions: ['.js', '.ts']
            },
            browsers: ['ChromeHeadless'],
            frameworks: ['jasmine'],
            preprocessors: {
                'test/**/*.ts': ['webpack']
            },
            webpack: {
                module: webpackConf.module,
                resolve: webpackConf.resolve
              },
            files: ['test/unit/*.spec.ts'],
            plugins: ['karma-webpack', 'karma-jasmine', 'karma-chrome-launcher']
        })
}  