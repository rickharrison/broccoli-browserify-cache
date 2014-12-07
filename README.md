# broccoli-browserify-cache

[Broccoli](https://github.com/broccolijs/broccoli) plugin to use browserify to bundle all of your dependencies. It will cache the node_modules directory for faster re-builds.

## Installation

```js
npm install broccoli-browserify-cache --save-dev
```

## Usage

```js
var browserify = require('broccoli-browserify-cache');

var outputTree = browserify(inputTree, {
  entries: ['./main'],
  outputFile: 'foo.js'
});
```

## Options

  - `entries` - Array of files to be used as the entry for browserify
  - `outputFile` - Relative path of the output file.
  - `browserifyOptions` - Options passed to the browserify constructor
