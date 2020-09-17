var exec = require('child_process').execFile
var execFileSync = require('child_process').execFileSync
var path = require('path')
var removeEmptyLines = require('./remove-empty-lines')

module.exports = function (gitWorkTree, command, callback) {
  var gitCommand = gitWorkTree
    ? [
      'git',
      '--git-dir=' + path.join(gitWorkTree, '.git'),
      '--work-tree=' + gitWorkTree,
      command
    ].join(' ').split(' ')
    : [
      'git',
      command
    ].join(' ').split(' ')
  
  if (callback) {
    console.log(gitCommand[0])
    exec(gitCommand[0], gitCommand.slice(1), function (err, stdout) {
      if (err) { return callback(err) }
      callback(null, removeEmptyLines(stdout))
    })
  } else {
    return removeEmptyLines('' + execFileSync(gitCommand[0], gitCommand.slice(1)))
  }
}
