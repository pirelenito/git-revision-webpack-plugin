var writeCommithashFile = require('./write-commithash-file')
var writeVersionFile = require('./write-version-file')

function GitRevisionPlugin () {}

GitRevisionPlugin.prototype.apply = function (compiler) {
  writeCommithashFile(compiler)
  writeVersionFile(compiler)
}

module.exports = GitRevisionPlugin
