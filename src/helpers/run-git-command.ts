import { exec } from 'child_process'
import { execSync } from 'child_process'
import path from 'path'
import removeEmptyLines from './remove-empty-lines'

interface Cb {
  (err: Error | null, output: string): void
}

export default function(gitWorkTree: string | undefined, command: string, callback?: Cb) {
  const gitCommand = gitWorkTree
    ? ['git', '--git-dir=' + path.join(gitWorkTree, '.git'), '--work-tree=' + gitWorkTree, command].join(' ')
    : ['git', command].join(' ')

  if (callback) {
    exec(gitCommand, function(err, stdout) {
      if (err) {
        return callback(err, '')
      }
      callback(null, removeEmptyLines(stdout))
    })

    return null
  } else {
    return removeEmptyLines(`${execSync(gitCommand)}`)
  }
}
