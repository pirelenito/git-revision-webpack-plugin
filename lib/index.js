var buildFile = require('./build-file')

function GitRevisionPlugin () {}

GitRevisionPlugin.prototype.apply = function (compiler) {
  buildFile(compiler, 'git rev-parse HEAD', /\[git-revision-hash\]/gi, 'COMMITHASH')
  buildFile(compiler, 'git describe', /\[git-revision-version\]/gi, 'VERSION')
}

module.exports = GitRevisionPlugin
