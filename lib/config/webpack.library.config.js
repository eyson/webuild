module.exports = {
    resolve: {
        extensions: ['', '.js']
    },
    output: {
        filename: '[name].js',
        library: ['Library', '[name]'],
        libraryTarget: 'umd'
    }
}
