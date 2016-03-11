/*jshint asi: true, expr: true */
(function() {
  require(__dirname + '/../util/helper');

  var assert = require('assert');
  var sinon = require('sinon');
  var chai = require('chai');
  var expect = chai.expect;
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
      it.only('succed in a brand new endeavour', function(done) {
        // TODO - use chai-as-promised
        var deferred = Q.defer(); 
        deferred.promise.then(function(data) {
          //expect(12).to.be.equal(123);
          console.log('received words: ' + data.length);
          done(); 
        },
        function (err) {
          done(err);
        });
        readAndSplit('../doc/considerPhlebas.txt', deferred);
      }); 
    });
  });
  
  function readAndSplit(filename, deferred) {
    var filePath = path.join(__dirname, filename);

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
  }
})();