import webpack from 'webpack'
import fs from 'fs-extra'
import path from 'path'
import GitRevisionPlugin from '../src'

const sourceProject = path.join(__dirname, '../fixtures/project')
const sourceGitRepository = path.join(__dirname, '../fixtures/git-repository')

const targetProject = path.join(__dirname, '../tmp/project')
const targetProjectConfig = path.join(targetProject, 'webpack.config.js')
const targetGitRepository = path.join(__dirname, '../tmp/project/.git')

const targetBuild = path.join(__dirname, '../tmp/build')

describe('git-revision-webpack-plugin default', function() {
  beforeEach(function(done) {
    fs.emptyDirSync(targetProject)
    fs.copySync(sourceProject, targetProject)

    fs.emptyDirSync(targetGitRepository)
    fs.copySync(sourceGitRepository, targetGitRepository)

    fs.remove(targetBuild)

    const config = require(targetProjectConfig)

    config.context = targetProject
    config.output.path = targetBuild
    config.plugins = [
      new GitRevisionPlugin({
        branch: true,
        gitWorkTree: targetProject,
      }),
    ]

    webpack(config, function() {
      done()
    })
  })

  it('should create the VERSION file', function() {
    const versionPath = path.join(targetBuild, 'VERSION')
    const VERSION = fs.readFileSync(versionPath)

    expect(VERSION.toString()).toEqual('v1.0.0-1-g9a15b3b')
  })

  it('should create the COMMITHASH file', function() {
    const versionPath = path.join(targetBuild, 'COMMITHASH')
    const COMMITHASH = fs.readFileSync(versionPath)

    expect(COMMITHASH.toString()).toEqual('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2')
  })

  it('should create the BRANCH file', function() {
    const branchPath = path.join(targetBuild, 'BRANCH')
    const BRANCH = fs.readFileSync(branchPath)

    expect(BRANCH.toString()).toEqual('master')
  })

  describe('[git-revision-version], [git-revision-hash] and [git-revision-branch] templates', function() {
    it('should support templates in the output.filename', function() {
      const versionPath = path.join(targetBuild, 'main-master-v1.0.0-1-g9a15b3b.js')
      fs.readFileSync(versionPath)
    })

    it('should support setting the public path', function() {
      const versionPath = path.join(targetBuild, 'main-master-v1.0.0-1-g9a15b3b.js')

      const mainJs = fs.readFileSync(versionPath, 'utf8')
      const expectedPublicPath =
        'r.p="http://cdn.com/assets/master/v1.0.0-1-g9a15b3b/9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2"'

      expect(mainJs.indexOf(expectedPublicPath) !== -1).toEqual(true)
    })
  })

  describe('public API', () => {
    it('should expose the commithash', () => {
      const plugin = new GitRevisionPlugin({ gitWorkTree: targetProject })
      expect(plugin.commithash()).toEqual('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2')
    })

    it('should expose the version', () => {
      const plugin = new GitRevisionPlugin({ gitWorkTree: targetProject })
      expect(plugin.version()).toEqual('v1.0.0-1-g9a15b3b')
    })

    it('should expose the branch', () => {
      const plugin = new GitRevisionPlugin({ gitWorkTree: targetProject })
      expect(plugin.branch()).toEqual('master')
    })
  })
})

describe('git-revision-webpack-plugin with lightweightTags option', function() {
  beforeEach(function(done) {
    fs.emptyDirSync(targetProject)
    fs.copySync(sourceProject, targetProject)

    fs.emptyDirSync(targetGitRepository)
    fs.copySync(sourceGitRepository, targetGitRepository)

    fs.remove(targetBuild)

    const config = require(targetProjectConfig)

    config.context = targetProject
    config.output.path = targetBuild
    config.plugins = [
      new GitRevisionPlugin({
        gitWorkTree: targetProject,
        lightweightTags: true,
        branch: true,
      }),
    ]

    webpack(config, function() {
      done()
    })
  })

  it('should create the VERSION file', function() {
    const versionPath = path.join(targetBuild, 'VERSION')
    const VERSION = fs.readFileSync(versionPath)

    expect(VERSION.toString()).toEqual('v2.0.0-beta')
  })

  it('should create the COMMITHASH file', function() {
    const versionPath = path.join(targetBuild, 'COMMITHASH')
    const COMMITHASH = fs.readFileSync(versionPath)

    expect(COMMITHASH.toString()).toEqual('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2')
  })

  it('should create the BRANCH file', function() {
    const branchPath = path.join(targetBuild, 'BRANCH')
    const BRANCH = fs.readFileSync(branchPath)

    expect(BRANCH.toString()).toEqual('master')
  })

  describe('[git-revision-version], [git-revision-hash] and [git-revision-branch] templates', function() {
    it('should support templates in the output.filename', function() {
      const versionPath = path.join(targetBuild, 'main-master-v2.0.0-beta.js')
      fs.readFileSync(versionPath)
    })

    it('should support setting the public path', function() {
      const versionPath = path.join(targetBuild, 'main-master-v2.0.0-beta.js')
      const mainJs = fs.readFileSync(versionPath, 'utf8')

      const expectedPublicPath =
        'r.p="http://cdn.com/assets/master/v2.0.0-beta/9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2"'

      expect(mainJs.indexOf(expectedPublicPath) !== -1).toEqual(true)
    })
  })

  describe('public API', () => {
    it('should expose the commithash', () => {
      const plugin = new GitRevisionPlugin({ gitWorkTree: targetProject, lightweightTags: true })
      expect(plugin.commithash()).toEqual('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2')
    })

    it('should expose the version', () => {
      const plugin = new GitRevisionPlugin({ gitWorkTree: targetProject, lightweightTags: true })
      expect(plugin.version()).toEqual('v2.0.0-beta')
    })

    it('should expose the branch', () => {
      const plugin = new GitRevisionPlugin({ gitWorkTree: targetProject, lightweightTags: true })
      expect(plugin.branch()).toEqual('master')
    })
  })
})

describe('git-revision-webpack-plugin without branch option', function() {
  beforeEach(function(done) {
    fs.emptyDirSync(targetProject)
    fs.copySync(sourceProject, targetProject)

    fs.emptyDirSync(targetGitRepository)
    fs.copySync(sourceGitRepository, targetGitRepository)

    fs.remove(targetBuild)

    const config = require(targetProjectConfig)

    config.context = targetProject
    config.output.path = targetBuild
    config.plugins = [
      new GitRevisionPlugin({
        gitWorkTree: targetProject,
      }),
    ]

    webpack(config, function() {
      done()
    })
  })

  it('should create the VERSION file', function() {
    const versionPath = path.join(targetBuild, 'VERSION')
    const VERSION = fs.readFileSync(versionPath)

    expect(VERSION.toString()).toEqual('v1.0.0-1-g9a15b3b')
  })

  it('should create the COMMITHASH file', function() {
    const versionPath = path.join(targetBuild, 'COMMITHASH')
    const COMMITHASH = fs.readFileSync(versionPath)

    expect(COMMITHASH.toString()).toEqual('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2')
  })

  it('should not create the BRANCH file', function() {
    const branchPath = path.join(targetBuild, 'BRANCH')
    expect(fs.existsSync(branchPath)).toEqual(false)
  })
})
