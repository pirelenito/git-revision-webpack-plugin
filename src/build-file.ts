import runGitCommand from './helpers/run-git-command'
import { Compiler } from 'webpack'

interface BuildFileOptions {
  compiler: Compiler
  gitWorkTree?: string
  command: string
  replacePattern: RegExp
  asset: string
}

export default function buildFile({ compiler, gitWorkTree, command, replacePattern, asset }: BuildFileOptions) {
  let data: string | undefined = ''

  compiler.hooks.compilation.tap('GitRevisionWebpackPlugin', compilation => {
    compilation.hooks.optimizeTree.tapAsync('optimize-tree', (_, __, callback) => {
      runGitCommand(gitWorkTree, command, function(err, res) {
        if (err) {
          return callback(err)
        }
        data = res

        callback()
      })
    })

    // we are missing the type definition for assetPath
    // TODO: create a PR to DefinitelyTyped
    const mainTemplate = compilation.mainTemplate as any

    // TODO remove `any` once we get the type definitions
    mainTemplate.hooks.assetPath.tap('GitRevisionWebpackPlugin', (assetPath: any, chunkData: any) => {
      const path = typeof assetPath === 'function' ? assetPath(chunkData) : assetPath

      if (!data) return path
      return path.replace(replacePattern, data)
    })
  })

  compiler.hooks.emit.tap('GitRevisionWebpackPlugin', compilation => {
    compilation.assets[asset] = {
      source: function() {
        return data
      },
      size: function() {
        return data ? data.length : 0
      },
    }
  })
}
