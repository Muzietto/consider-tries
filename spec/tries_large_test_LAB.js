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

  var code = require('../js/tries');
  var TRIE = code.TRIE;
  
  var fs = require('fs');
  var path = require('path');

  describe('by reading files', function() {
    describe('one can', function() {
      it('check parts of the resolved promise', function() {
        var words = readAndSplit('../doc/considerPhlebas.txt');
        return words.then(function(data) {
          expect(data.length).to.equal(172027); 
        });
      }); 
      it('check the resolved promise as a whole', function() {
        var wordsNumber = lengthOfReadAndSplit('../doc/considerPhlebas.txt');
        return expect(wordsNumber).to.eventually.be.within(172026, 172028); 
      }); 
    });
  });

  function lengthOfReadAndSplit(filename) {
    var xxx = Q.defer();
    readAndSplit(filename).then(function(data) {
      xxx.resolve(data.length);
    });
    return xxx.promise;
  }
  
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