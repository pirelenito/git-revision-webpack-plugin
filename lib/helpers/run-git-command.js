var exec = require('child_process').execFile
var execSync = require('child_process').execSync
var path = require('path')
var removeEmptyLines = require('./remove-empty-lines')

module.exports = function (gitWorkTree, command, callback) {
  var gitCommand = gitWorkTree
    ? [
      'git',
      '--git-dir=' + path.join(gitWorkTree, '.git'),
      '--work-tree=' + gitWorkTree,
      command
    ].join(' ')
    : [
      'git',
      command
    ].join(' ')

  gitCommand = gitCommand.split(' ')
  if (callback) {
    exec(gitCommand[0], gitCommand.slice(1), function (err, stdout) {
      if (err) { return callback(err) }
      callback(null, removeEmptyLines(stdout))
    })
  } else {
    return removeEmptyLines('' + execSync(gitCommand))
  }
}
