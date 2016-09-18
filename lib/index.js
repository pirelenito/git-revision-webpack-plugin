var buildFile = require('./build-file')
var runGitCommand = require('./helpers/run-git-command')

var COMMITHASH_COMMAND = 'rev-parse HEAD'
var VERSION_COMMAND = 'describe --always'

function GitRevisionPlugin (options) {
  this.gitWorkTree = options && options.gitWorkTree
  this.lightweightTags = options && options.lightweightTags || false
  this.commithashCommand = options && options.commithashCommand || COMMITHASH_COMMAND
  this.versionCommand = options && options.versionCommand || VERSION_COMMAND
}

GitRevisionPlugin.prototype.apply = function (compiler) {
  buildFile(compiler, this.gitWorkTree, this.commithashCommand, /\[git-revision-hash\]/gi, 'COMMITHASH')
  buildFile(compiler, this.gitWorkTree, this.versionCommand + (this.lightweightTags ? ' --tags' : ''), /\[git-revision-version\]/gi, 'VERSION')
}

GitRevisionPlugin.prototype.commithash = function (callback) {
  return runGitCommand(this.gitWorkTree, this.commithashCommand)
}

GitRevisionPlugin.prototype.version = function (callback) {
  return runGitCommand(this.gitWorkTree, this.versionCommand + (this.lightweightTags ? ' --tags' : ''))
}

module.exports = GitRevisionPlugin
