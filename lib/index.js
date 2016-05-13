var buildFile = require('./build-file')

function GitRevisionPlugin (options) {
  this.gitWorkTree = options && options.gitWorkTree
}

GitRevisionPlugin.prototype.apply = function (compiler) {
  buildFile(compiler, this.gitWorkTree, 'rev-parse HEAD', /\[git-revision-hash\]/gi, 'COMMITHASH')
  buildFile(compiler, this.gitWorkTree, 'describe --always', /\[git-revision-version\]/gi, 'VERSION')
}

module.exports = GitRevisionPlugin
