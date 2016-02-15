var exec = require('child_process').exec
var removeEmptyLines = require('./helpers/remove-empty-lines.js')

module.exports = function buildFile (compiler, command, asset) {
  compiler.plugin('emit', function (compilation, callback) {
    exec(command, function (err, stdout) {
      if (err) { return callback(err) }
      const version = removeEmptyLines(stdout)

      compilation.assets[asset] = {
        source: function () {
          return version
        },
        size: function () {
          return version.length
        }
      }

      callback()
    })
  })
}
