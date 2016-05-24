var runGitCommand = require('./helpers/run-git-command')

module.exports = function buildFile (compiler, gitWorkTree, command, replacePattern, asset) {
  var data = ''

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('optimize-tree', function (chunks, modules, callback) {
      runGitCommand(gitWorkTree, command, function (err, res) {
        if (err) { return callback(err) }
        data = res

        callback()
      })
    })

    compilation.mainTemplate.plugin('asset-path', function (path) {
      return path.replace(replacePattern, data)
    })
  })

  compiler.plugin('emit', function (compilation, callback) {
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
