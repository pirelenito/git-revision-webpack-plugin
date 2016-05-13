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

describe('git-revision-webpack-plugin', function () {
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

    expect(VERSION.toString()).to.eql('v1.0.0')
  })

  it('should create the COMMITHASH file', function () {
    var versionPath = path.join(targetBuild, 'COMMITHASH')
    var COMMITHASH = fs.readFileSync(versionPath)

    expect(COMMITHASH.toString()).to.eql('10e1ff4c17ad1f12241b5c4d9a708a76e98289d8')
  })

  describe('[git-revision-version] and [git-revision-hash] templates', function () {
    it('should support templates in the output.filename', function () {
      var versionPath = path.join(targetBuild, 'main-v1.0.0.js')
      fs.readFileSync(versionPath)
    })

    it('should support setting the public path', function () {
      var versionPath = path.join(targetBuild, 'main-v1.0.0.js')
      var mainJs = fs.readFileSync(versionPath)

      var expectedPublicPath = '__webpack_require__.p = "http://cdn.com/assets/v1.0.0/10e1ff4c17ad1f12241b5c4d9a708a76e98289d8";'

      expect(mainJs.indexOf(expectedPublicPath) !== -1).to.eql(true)
    })
  })
})
