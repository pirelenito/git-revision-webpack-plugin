var buildFile = require('./build-file')

function GitRevisionPlugin () {}

GitRevisionPlugin.prototype.apply = function (compiler) {
  buildFile(compiler, 'rev-parse HEAD', /\[git-revision-hash\]/gi, 'COMMITHASH')
  buildFile(compiler, 'describe --always', /\[git-revision-version\]/gi, 'VERSION')
}

module.exports = GitRevisionPlugin
