# Git Revision Webpack Plugin

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
