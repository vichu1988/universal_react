/**
 * Created by mambig on 3/29/17.
 */
const express = require('express');
const path = require('path');
const compression = require('compression');

// Dev middleware
const addDevMiddlewares = (app, options) => {
    const webpackConfig = require('./../../internals/webpack/webpack.dev.babel');

    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);
    const middleware = webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: options.publicPath || '/',
        silent: true,
        hot:true,
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false,
            hot:true
        },
        watchContentBase: true
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }));
};

// Production middlewares
const addProdMiddlewares = (app, options) => {
    const publicPath = options.publicPath || '/';
    const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

    // compression middleware compresses your server responses which makes them
    // smaller (applies also to assets).
    app.use(compression());
    app.use(publicPath, express.static(outputPath));

};

/**
 * Front-end middleware
 */
const applyMiddleware = (app, options)=>{
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
        addProdMiddlewares(app, options);
    } else {

        addDevMiddlewares(app, options);
    }

    return app;
};


export default applyMiddleware;