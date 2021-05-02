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
  let data: string = ''

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

    compilation.hooks.assetPath.tap('GitRevisionWebpackPlugin', (assetPath: any, chunkData: any) => {
      const path = typeof assetPath === 'function' ? assetPath(chunkData) : assetPath

      if (!data) return path
      return path.replace(replacePattern, data)
    })

    compilation.hooks.processAssets.tap('GitRevisionWebpackPlugin', assets => {
      assets[asset] = {
        source: function() {
          return data
        },
        size: function() {
          return data ? data.length : 0
        },
        buffer: function() {
          return Buffer.from(data)
        },
        map: function() {
          return {}
        },
        sourceAndMap: function() {
          return { source: data, map: {} }
        },
        updateHash: function() {},
      }
    })
  })
}
