module.exports = {
  entry: './index.js',

  output: {
    publicPath: 'http://cdn.com/assets/[git-revision-branch]/[git-revision-version]/[git-revision-hash]',
    filename: '[name]-[git-revision-branch]-[git-revision-version].js',
  },

  module: {
    rules: [
      {
        test: /\.(txt)$/,
        use: 'file-loader?name=[name]-[git-revision-branch]-[git-revision-version].[ext]',
      },
    ],
  },
}
