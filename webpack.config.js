var webpack = require('webpack')

module.exports = {
    entry: "./js/index.js",
    output: {
        path: __dirname + "/js/",
        filename: "userprofile.js"
    },
    
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015", "react"]
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
        ],
        // rules: [
        //     {
        //       test: /\.utils\.js$/,
        //       use: [ 'script-loader' ]
        //     }
        // ]
    },
    
    // plugins: [
    //     new webpack.DefinePlugin({
    //         'process.env': {
    //             NODE_ENV: JSON.stringify('production')
    //         }
    //     }),
    //     new webpack.optimize.UglifyJsPlugin()
    // ]
}