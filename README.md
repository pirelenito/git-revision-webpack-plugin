# Git Revision Webpack Plugin

[![Build Status](https://travis-ci.org/pirelenito/git-revision-webpack-plugin.svg)](https://travis-ci.org/pirelenito/git-revision-webpack-plugin)
[![npm version](https://badge.fury.io/js/git-revision-webpack-plugin.svg)](https://badge.fury.io/js/git-revision-webpack-plugin)
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

And a `COMMITHASH` such as:

```
7c16d8b1abeced419c14eb9908baeb4229ac0542
```

If you need [lightweight tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging#Lightweight-Tags) support, you may turn on `lighweithTags` option in this way:

```javascript
var GitRevisionPlugin = require('git-revision-webpack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({ lightweightTags: true })
  ]
}
```

### Path Substitutions

It is also possible to use two [path substituitions](http://webpack.github.io/docs/configuration.html#output-filename) on build to get either the revision or version as part of output paths.

- `[git-revision-version]`
- `[git-revision-hash]`

Example:

```javascript
module.exports = {
  output: {
    publicPath: 'http://my-fancy-cdn.com/[git-revision-version]/',
    filename: '[name]-[git-revision-hash].js'
  }
}
```

### Public API

The `VERSION` and `COMMITHASH` are also exposed through a public API.

Example using the [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin):

```javascript
var gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  plugins: [
    new DefinePlugin({
      'VERSION': JSON.stringify(gitRevisionPlugin.version()),
      'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
    })
  ]
}
```
