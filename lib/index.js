var buildFile = require('./build-file')
var runGitCommand = require('./helpers/run-git-command')

var COMMITHASH_COMMAND = 'rev-parse HEAD'
var VERSION_COMMAND = 'describe --always'

function GitRevisionPlugin (options) {
  options = options || {}

  this.gitWorkTree = options.gitWorkTree

  this.commithashCommand = options.commithashCommand ||
    COMMITHASH_COMMAND

  this.versionCommand = options.versionCommand ||
    VERSION_COMMAND + (options.lightweightTags ? ' --tags' : '')

  if (options.versionCommand && options.lightweightTags) {
    throw new Error('lightweightTags can\'t be used together versionCommand')
  }
}

GitRevisionPlugin.prototype.apply = function (compiler) {
  buildFile(
    compiler,
    this.gitWorkTree,
    this.commithashCommand,
    /\[git-revision-hash\]/gi,
    'COMMITHASH'
  )

  buildFile(
    compiler,
    this.gitWorkTree,
    this.versionCommand,
    /\[git-revision-version\]/gi,
    'VERSION'
  )
}

GitRevisionPlugin.prototype.commithash = function () {
  return runGitCommand(
    this.gitWorkTree,
    this.commithashCommand
  )
}

GitRevisionPlugin.prototype.version = function () {
  return runGitCommand(
    this.gitWorkTree,
    this.versionCommand
  )
}

module.exports = GitRevisionPlugin
