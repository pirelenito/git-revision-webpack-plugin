/* global describe, beforeEach, it */

var expect = require('chai').expect
var webpack = require('webpack')
var fs = require('fs-extra')
var path = require('path')
var GitRevisionPlugin = require('.')

var sourceProject = path.join(__dirname, '../fixtures/project')
var sourceGitRepository = path.join(__dirname, '../fixtures/git-repository')

var targetProject = path.join(__dirname, '../tmp/project')
var targetProjectConfig = path.join(targetProject, 'webpack.config.js')
var targetGitRepository = path.join(__dirname, '../tmp/project/.git')

var targetBuild = path.join(__dirname, '../tmp/build')

describe('git-revision-webpack-plugin (integration)', function () {
  beforeEach(function (done) {
    fs.emptyDirSync(targetProject)
    fs.copySync(sourceProject, targetProject)

    fs.emptyDirSync(targetGitRepository)
    fs.copySync(sourceGitRepository, targetGitRepository)

    fs.remove(targetBuild)

    var config = require(targetProjectConfig)

    config.context = targetProject
    config.output.path = targetBuild
    config.plugins = [
      new GitRevisionPlugin({ gitWorkTree: targetProject })
    ]

    webpack(config, function () {
      done()
    })
  })

  it('should create the VERSION file', function () {
    var versionPath = path.join(targetBuild, 'VERSION')
    var VERSION = fs.readFileSync(versionPath)

    expect(VERSION.toString()).to.eql('v1.0.0-1-g9a15b3b')
  })

  it('should create the COMMITHASH file', function () {
    var versionPath = path.join(targetBuild, 'COMMITHASH')
    var COMMITHASH = fs.readFileSync(versionPath)

    expect(COMMITHASH.toString()).to.eql('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2')
  })

  describe('[git-revision-version] and [git-revision-hash] templates', function () {
    it('should support templates in the output.filename', function () {
      var versionPath = path.join(targetBuild, 'main-v1.0.0-1-g9a15b3b.js')
      fs.readFileSync(versionPath)
    })

    it('should support setting the public path', function () {
      var versionPath = path.join(targetBuild, 'main-v1.0.0-1-g9a15b3b.js')
      var mainJs = fs.readFileSync(versionPath)

      var expectedPublicPath = '__webpack_require__.p = "http://cdn.com/assets/v1.0.0-1-g9a15b3b/9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2";'

      expect(mainJs.indexOf(expectedPublicPath) !== -1).to.eql(true)
    })
  })

  describe('public API', () => {
    it('should expose the commithash', () => {
      var plugin = new GitRevisionPlugin({ gitWorkTree: targetProject })
      expect(plugin.commithash()).to.eql('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2')
    })

    it('should expose the version', () => {
      var plugin = new GitRevisionPlugin({ gitWorkTree: targetProject })
      expect(plugin.version()).to.eql('v1.0.0-1-g9a15b3b')
    })
  })
})

describe('git-revision-webpack-plugin with lightweightTags option', function () {
  beforeEach(function (done) {
    fs.emptyDirSync(targetProject)
    fs.copySync(sourceProject, targetProject)

    fs.emptyDirSync(targetGitRepository)
    fs.copySync(sourceGitRepository, targetGitRepository)

    fs.remove(targetBuild)

    var config = require(targetProjectConfig)

    config.context = targetProject
    config.output.path = targetBuild
    config.plugins = [
      new GitRevisionPlugin({ gitWorkTree: targetProject, lightweightTags: true })
    ]

    webpack(config, function () {
      done()
    })
  })

  it('should create the VERSION file', function () {
    var versionPath = path.join(targetBuild, 'VERSION')
    var VERSION = fs.readFileSync(versionPath)

    expect(VERSION.toString()).to.eql('v2.0.0-beta')
  })

  it('should create the COMMITHASH file', function () {
    var versionPath = path.join(targetBuild, 'COMMITHASH')
    var COMMITHASH = fs.readFileSync(versionPath)

    expect(COMMITHASH.toString()).to.eql('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2')
  })

  describe('[git-revision-version] and [git-revision-hash] templates', function () {
    it('should support templates in the output.filename', function () {
      var versionPath = path.join(targetBuild, 'main-v2.0.0-beta.js')
      fs.readFileSync(versionPath)
    })

    it('should support setting the public path', function () {
      var versionPath = path.join(targetBuild, 'main-v2.0.0-beta.js')
      var mainJs = fs.readFileSync(versionPath)

      var expectedPublicPath = '__webpack_require__.p = "http://cdn.com/assets/v2.0.0-beta/9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2";'

      expect(mainJs.indexOf(expectedPublicPath) !== -1).to.eql(true)
    })
  })

  describe('public API', () => {
    it('should expose the commithash', () => {
      var plugin = new GitRevisionPlugin({ gitWorkTree: targetProject, lightweightTags: true })
      expect(plugin.commithash()).to.eql('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2')
    })

    it('should expose the version', () => {
      var plugin = new GitRevisionPlugin({ gitWorkTree: targetProject, lightweightTags: true })
      expect(plugin.version()).to.eql('v2.0.0-beta')
    })
  })
})

