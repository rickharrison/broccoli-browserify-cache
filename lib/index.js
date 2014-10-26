var browserify = require('browserify');
var CachingWriter = require('broccoli-caching-writer');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var Promise = require('rsvp').Promise;

function BrowserifyCache(inputTree, options) {
  if (!(this instanceof BrowserifyCache)) {
    return new BrowserifyCache(inputTree, options);
  }

  this.enforceSingleInputTree = true;
  CachingWriter.apply(this, arguments);

  options = options || {};

  this.entries = options.entries;
  this.outputFile = options.outputFile;

  this._cache = {};
}

BrowserifyCache.prototype = Object.create(CachingWriter.prototype);
BrowserifyCache.prototype.constructor = BrowserifyCache;

BrowserifyCache.prototype.updateCache = function (srcDir, destDir) {
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

module.exports = BrowserifyCache;
