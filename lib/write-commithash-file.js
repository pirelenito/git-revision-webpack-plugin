var exec = require('child_process').exec
var removeEmptyLines = require('./helpers/remove-empty-lines.js')

module.exports = function writeCommithashFile (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    exec('git rev-parse HEAD', function (err, stdout) {
      if (err) { return callback(err) }
      const version = removeEmptyLines(stdout)

      compilation.assets['COMMITHASH'] = {
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
