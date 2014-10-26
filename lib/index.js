var browserify = require('browserify');
var CachingWriter = require('broccoli-caching-writer');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var Promise = require('rsvp').Promise;

function BrowserifyBundler(inputTree, options) {
  if (!(this instanceof BrowserifyBundler)) {
    return new BrowserifyBundler(inputTree, options);
  }

  this.enforceSingleInputTree = true;
  CachingWriter.apply(this, arguments);

  options = options || {};

  this.entries = options.entries;
  this.outputFile = options.outputFile;

  this._cache = {};
}

BrowserifyBundler.prototype = Object.create(CachingWriter.prototype);
BrowserifyBundler.prototype.constructor = BrowserifyBundler;

BrowserifyBundler.prototype.updateCache = function (srcDir, destDir) {
  var cache = this._cache;
  var outputFile = this.outputFile;

  var b = browserify({
    basedir: srcDir,
    cache: cache,
    entries: this.entries,
    fullPaths: true
  });

  b.on('dep', function (dep) {
    if (typeof dep.id === 'string') {
      if (dep.id.indexOf(srcDir) === -1) {
        cache[dep.id] = dep;
      }
    }
  });

  return new Promise(function (resolve, reject) {
    var destFile = path.join(destDir, outputFile);

    mkdirp.sync(path.dirname(destFile));

    b.bundle(function (err, buf) {
      if (err) return reject(err);

      fs.writeFileSync(destFile, buf);
      resolve();
    });
  });
};

module.exports = BrowserifyBundler;
