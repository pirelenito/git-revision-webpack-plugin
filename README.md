# Git Revision Webpack Plugin

Simple [webpack](http://webpack.github.io/) plugin that generates `VERSION` and `COMMITHASH` files during build based on a local [git](http://www.git-scm.com/) repository.

## Usage

```bash
npm install --save-dev git-revision-webpack-plugin
```

Sample webpack config:

```javascript
var GitRevisionPlugin = require('git-revision-webpack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin()
  ]
}
```
