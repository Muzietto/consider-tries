/*jshint asi: true, expr: true */
(function() {
  require(__dirname + '/../util/helper');

  var assert = require('assert');
  var sinon = require('sinon');
  var chai = require('chai');
  var chaiAsPromised = require('chai-as-promised');
  var expect = chai.expect;
  chai.use(chaiAsPromised);
  chai.use(require('sinon-chai'));
  var JSON2 = require('JSON2');
  var stringify = JSON2.stringify;
  var parse = JSON2.parse;
  var fs = require('fs');
  var Q = require('q');

  var H = require(__dirname + '/../util/helper');
  var TRIE = require('../js/tries').TRIE;
  
  var fs = require('fs');
  var path = require('path');
  
  describe('after loading arrays of words from large files', function() {
    beforeEach(function() {
      this.words = readAndSplit('../doc/considerPhlebas.txt');
    });
    it.only('can build very large tries', function() {
      this.words.then(function(data) {
        var startMillis = new Date().getTime();
        H.log('Start building the trie: ' + new Date().toString());
        var trie = {},counter=0;
        data.forEach(function(word) {
          H.log(++counter+'\033[F');
          trie = TRIE.put(word, TRIE.incr, trie);
        });
        H.log(counter);
        var endMillis = new Date().getTime();
        var elapsed;
        try { elapsed = (endMillis - startMillis)/1000} catch (e) {}
        H.log('Trie complete: ' + new Date().toString());
        H.log('Processing time in secs: ' + elapsed);
        H.log('TRIE.size(trie): ' + TRIE.size(trie));
      });
    });
  });
  
  function readAndSplit(filename) {
    var filePath = path.join(__dirname, filename);
    var deferred = Q.defer();
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
      if (!err) { 
        var words = data
          .split(/[,.;:!?\s\n]/)
          .map(function(word) {
            return word
              .replace(/[\r\n,\.;:\(\)\!\?]|(?:'s|')/g,'');
          })
          .filter(function(x) { 
            return x !== ''
              && x !== "'"
          });
        deferred.resolve(words);
      } else {
        deferred.reject(err);
      }
    });
    return deferred.promise;
  }
})();