var path = require('path');

export default () => (
    {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'ctjs-di.js',
            libraryTarget: 'umd',
            library: 'ctjs-di'
        },
        module: {
            rules: [
                {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
            ]
        },
    }
);