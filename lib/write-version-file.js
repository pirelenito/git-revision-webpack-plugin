var exec = require('child_process').exec
var removeEmptyLines = require('./helpers/remove-empty-lines.js')

module.exports = function writeVersionFile (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    exec('git describe', function (err, stdout) {
      if (err) { callback(err) }
      const version = removeEmptyLines(stdout)

      compilation.assets['VERSION'] = {
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
