var runGitCommand = require('./helpers/run-git-command')

module.exports = function buildFile (compiler, gitWorkTree, command, replacePattern, asset) {
  var data = ''

  compiler.hooks.compilation.tap('GitRevisionWebpackPlugin', function (compilation) {
    compilation.hooks.optimizeTree.tapAsync('GitRevisionWebpackPlugin', function (chunks, modules, callback) {
      runGitCommand(gitWorkTree, command, function (err, res) {
        if (err) { return callback(err) }
        data = res

        callback()
      })
    })

    compilation.mainTemplate.hooks.assetPath.tap('GitRevisionWebpackPlugin', function (path) {
      return path.replace(replacePattern, data)
    })
  })

  compiler.hooks.emit.tapAsync('GitRevisionWebpackPlugin', function (compilation, callback) {
    compilation.assets[asset] = {
      source: function () {
        return data
      },
      size: function () {
        return data.length
      }
    }

    callback()
  })
}
