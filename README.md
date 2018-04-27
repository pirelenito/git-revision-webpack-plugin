# Git Revision Webpack Plugin

[![Build Status](https://travis-ci.org/pirelenito/git-revision-webpack-plugin.svg)](https://travis-ci.org/pirelenito/git-revision-webpack-plugin)
[![npm version](https://badge.fury.io/js/git-revision-webpack-plugin.svg)](https://badge.fury.io/js/git-revision-webpack-plugin)
[![downloads](https://img.shields.io/npm/dm/git-revision-webpack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/git-revision-webpack-plugin)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Code Climate](https://codeclimate.com/github/pirelenito/git-revision-webpack-plugin/badges/gpa.svg)](https://codeclimate.com/github/pirelenito/git-revision-webpack-plugin)

Simple [webpack](http://webpack.github.io/) plugin that generates `VERSION` and `COMMITHASH` files during build based on a local [git](http://www.git-scm.com/) repository.

## Usage

Given a webpack project, install it as a local development dependency:

```bash
npm install --save-dev git-revision-webpack-plugin
```

Then, simply configure it as a plugin in the webpack config:

```javascript
var GitRevisionPlugin = require('git-revision-webpack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin()
  ]
}
```

It outputs a `VERSION` based on [git-describe](http://www.git-scm.com/docs/git-describe) such as:

```
v0.0.0-34-g7c16d8b
```

A `COMMITHASH` such as:

```
7c16d8b1abeced419c14eb9908baeb4229ac0542
```

And (optionally [when branch is enabled](#branch-false)) a `BRANCH` such as:

```
master
```

## Path Substitutions

It is also possible to use [path substituitions](http://webpack.github.io/docs/configuration.html#output-filename) on build to get the revision, version or branch as part of output paths.

- `[git-revision-version]`
- `[git-revision-hash]`
- `[git-revision-branch]` (only [when branch is enabled](#branch-false))

Example:

```javascript
module.exports = {
  output: {
    publicPath: 'http://my-fancy-cdn.com/[git-revision-version]/',
    filename: '[name]-[git-revision-hash].js'
  }
}
```

## Plugin API

The `VERSION`, `COMMITHASH` and `BRANCH` are also exposed through a public API.

Example using the [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin):

```javascript
var gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  plugins: [
    new DefinePlugin({
      'VERSION': JSON.stringify(gitRevisionPlugin.version()),
      'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
      'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
    })
  ]
}
```

## Configuration

The plugin requires no configuration by default, but it is possible to configure it to support custom git workflows.

### `lightweightTags: false`

If you need [lightweight tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging#Lightweight-Tags) support, you may turn on `lightweightTags` option in this way:

```javascript
var GitRevisionPlugin = require('git-revision-webpack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      lightweightTags: true
    })
  ]
}
```

### `branch: false`

If you need branch name support, you may turn on `branch` option in this way:

```javascript
var GitRevisionPlugin = require('git-revision-webpack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      branch: true
    })
  ]
}
```

### `commithashCommand: 'rev-parse HEAD'`

To change the default `git` command used to read the value of `COMMITHASH`:

```javascript
var GitRevisionPlugin = require('git-revision-webpack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      commithashCommand: 'rev-list --max-count=1 --no-merges HEAD'
    })
  ]
}
```

### `versionCommand: 'describe --always'`

To change the default `git` command used to read the value of `VERSION`:

```javascript
var GitRevisionPlugin = require('git-revision-webpack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      versionCommand: 'describe --always --tags --dirty'
    })
  ]
}
```

### `branchCommand: 'rev-parse --abbrev-ref HEAD'`

To change the default `git` command used to read the value of `BRANCH`:

```javascript
var GitRevisionPlugin = require('git-revision-webpack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      branchCommand: 'rev-parse --symbolic-full-name HEAD'
    })
  ]
}
```

### `path: 'path/to/files'`

To change the output path of the `VERSION`, `COMMITHASH`, and `BRANCH` files (relative to Webpack's [`output.path`](https://webpack.js.org/configuration/output/#output-path) setting):

```javascript
var GitRevisionPlugin = require('git-revision-webpack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      path: 'common'
    })
  ]
}
```
