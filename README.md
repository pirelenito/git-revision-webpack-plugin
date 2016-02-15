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
