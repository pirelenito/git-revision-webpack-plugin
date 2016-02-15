var buildFile = require('./build-file')

function GitRevisionPlugin () {}

GitRevisionPlugin.prototype.apply = function (compiler) {
  buildFile(compiler, 'git rev-parse HEAD', 'COMMITHASH')
  buildFile(compiler, 'git describe', 'VERSION')
}

module.exports = GitRevisionPlugin
