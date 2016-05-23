var buildFile = require('./build-file')
var runGitCommand = require('./helpers/run-git-command')

var commithashCommand = 'rev-parse HEAD'
var versionCommand = 'describe --always'

function GitRevisionPlugin (options) {
  this.gitWorkTree = options && options.gitWorkTree
}

GitRevisionPlugin.prototype.apply = function (compiler) {
  buildFile(compiler, this.gitWorkTree, commithashCommand, /\[git-revision-hash\]/gi, 'COMMITHASH')
  buildFile(compiler, this.gitWorkTree, versionCommand, /\[git-revision-version\]/gi, 'VERSION')
}

GitRevisionPlugin.prototype.commithash = function (callback) {
  return runGitCommand(this.gitWorkTree, commithashCommand)
}

GitRevisionPlugin.prototype.version = function (callback) {
  return runGitCommand(this.gitWorkTree, versionCommand)
}

module.exports = GitRevisionPlugin
