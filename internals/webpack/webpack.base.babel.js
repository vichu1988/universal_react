/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const isNodeEnv = (process.env.NODE_ENV == 'development');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'stage-2'],
      },
    }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
        })
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader?name=onedigital/fonts/[name].[ext]',
      include: [/fonts/]
    }, {
      test: /\.(jpe?g|png|gif|svg)$/,
      loaders: [
        'file-loader?name=onedigital/images/[name].[ext]',
        {loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 4,
            },
            pngquant: {
              quality: '75-90',
              speed: 3,
            },
          },
        }
      ],
      exclude: [/fonts/]
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader?limit=10000',
    },
    { test: /\.handlebars$/, loader: "handlebars-loader" }
    ]
  },
  plugins: options.plugins.concat([


    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),



  ]),
  resolve: {
    modules: ['app', 'node_modules'],//Tell webpack what directories should be searched when resolving modules.
    extensions: [//Automatically resolve certain extensions.
      '.js',
      '.jsx',
      '.json',
    ],
    mainFields: [
      'browser',
      // Necessary hack because of a bug in redux-form
      // https://github.com/erikras/redux-form/issues/1637
      'main',
      'jsnext:main',
    ],
  },
  devtool: options.devtool,
  target: 'web', //Compile for usage in a browser-like environment,
    performance: options.performance || {},
});
