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
  var TRIE = require(__dirname + '/../js/tries').TRIE;
  
  var fs = require('fs');
  var jsonfile = require('jsonfile');
  var path = require('path');
  
  xdescribe('after loading arrays of words from large files', function() {
    beforeEach(function() {
      this.words = readAndSplit('/../doc/considerPhlebas.txt');
    });
    it('can build very large tries', function() {
      this.words.then(function(data) {
        var startMillis = new Date().getTime();
        H.log('Start building the trie: ' + new Date().toString());
        var trie = {},counter=0;
        data.forEach(function(word) {
          H.log(++counter + ': ' + word.toLowerCase() + '                                                  \033[F');
          trie = TRIE.put(word.toLowerCase(), TRIE.incr, trie);
        });
        H.log(counter);
        var endMillis = new Date().getTime();
        var elapsed;
        try { elapsed = (endMillis - startMillis)/1000 } catch (e) {}
        H.log('Trie complete: ' + new Date().toString());
        H.log('Processing time in secs: ' + elapsed);
        H.log('TRIE.size(trie): ' + TRIE.size(trie));
      });
    });
    it('can sort large lists and build a trie with the ordered words', function() {
      this.words.then(function(data) {
        var startMillis = new Date().getTime();
        H.log('Start sorting the list: ' + new Date().toString());
        var trie = {}, sorted = data.sort(),counter=0;
        H.log('Start building the trie: ' + new Date().toString());
        sorted.forEach(function(word) {
          H.log(++counter + ': ' + word.toLowerCase() + '                                                  \033[F');
          trie = TRIE.put(word.toLowerCase(), TRIE.incr, trie);
        });
        H.log(counter);
        var endMillis = new Date().getTime();
        var elapsed;
        try { elapsed = (endMillis - startMillis)/1000 } catch (e) {}
        H.log('Trie complete: ' + new Date().toString());
        H.log('Processing time in secs: ' + elapsed);
        H.log('TRIE.size(trie): ' + TRIE.size(trie));
      });
    });
    it('can make count tables out of large sorted lists and build a trie with the counts', function() {
      this.words.then(function(data) {
        var startMillis = new Date().getTime();
        H.log('Start sorting the list: ' + new Date().toString());
        var trie = {}, sorted = data.sort(), counter = 0, counts = {};
        H.log('Start building the count table: ' + new Date().toString());
        sorted.forEach(function(word) {
          var _word = word.toLowerCase();
          H.log(++counter + ': ' + _word + '                                                  \033[F');
          if (!counts[_word]) {
            counts[_word] = 1;
            return;
          }
          counts[_word]++;
          return;
        });
        counter = 0;
        H.log('End building the count table: ' + new Date().toString());
        H.log('Count table keys: ' + Object.keys(counts).length);
        H.log('Start building the trie: ' + new Date().toString());
        Object.keys(counts).forEach(function(_word) {
          var count = counts[_word];
          H.log(++counter + ': ' + _word + ' -> ' + count + '                                                     \033[F');
          trie = TRIE.put(_word, count, trie);
        });
        H.log(counter);
        var endMillis = new Date().getTime();
        var elapsed;
        try { elapsed = (endMillis - startMillis)/1000 } catch (e) {}
        H.log('Trie complete: ' + new Date().toString());
        H.log('Processing time in secs: ' + elapsed);
        H.log('TRIE.size(trie): ' + TRIE.size(trie));
      });
    });
  });
  xdescribe('willing to prepare half-baked results', function() {
    beforeEach(function() {
      this.filename = '/../doc/considerPhlebas.txt';
      //this.filename = '/../doc/cp.txt';
      this.words = readAndSplit(this.filename);
    });
    it('one can save large tries as JSON to use them later', function() {
      var self = this;
      return this.words.then(function(data) {
        var startMillis = new Date().getTime();
        H.log('Start sorting the list: ' + new Date().toString());
        var trie = {}, sorted = data.sort(), counter = 0, counts = {};
        H.log('Start building the count table: ' + new Date().toString());
        sorted.forEach(function(word) {
          var _word = word.toLowerCase();
          H.log(++counter + ': ' + _word + '                                                  \033[F');
          if (!counts[_word]) {
            counts[_word] = 1;
            return;
          }
          counts[_word]++;
          return;
        });
        counter = 0; 
        H.log('End building the count table: ' + new Date().toString());
        H.log('Count table keys: ' + Object.keys(counts).length);
        H.log('Start building the trie: ' + new Date().toString());
        Object.keys(counts).forEach(function(_word) {
          var count = counts[_word];
          H.log(++counter + ': ' + _word + ' -> ' + count + '                                                     \033[F');
          trie = TRIE.put(_word, count, trie);
        });
        H.log(counter);
        var endMillis = new Date().getTime();
        var elapsed;
        try { elapsed = (endMillis - startMillis)/1000 } catch (e) {}
        H.log('Trie complete: ' + new Date().toString());
        H.log('Processing time in secs: ' + elapsed);
        H.log('TRIE.size(trie): ' + TRIE.size(trie));
        var fileversion = Math.floor(Math.random() * 100000);
        var jsonfilename = __dirname + self.filename + '.' + fileversion + '.json'
        H.log('About to save trie in : ' + jsonfilename);
        jsonfile.writeFile(jsonfilename, trie, { spaces: 2 }, function(err) {
          console.error(err);
        })
        H.log('Trie saved in : ' + jsonfilename);
      });
    });
    it('one can save large JSON word count tables to use them later to compare with tries', function() {
      var self = this;
      return this.words.then(function(data) {
        H.log('Start sorting the list: ' + new Date().toString());
        var trie = {}, sorted = data.sort(), counter = 0, counts = {};
        H.log('Start building the count table: ' + new Date().toString());
        sorted.forEach(function(word) {
          var _word = word.toLowerCase();
          H.log(++counter + ': ' + _word + '                                                  \033[F'); 
          if (!counts[_word]) {
            counts[_word] = 1;
            return;
          }
          counts[_word]++;
          return;
        });
        counter = 0;
        H.log('End building the count table: ' + new Date().toString());
        H.log('Count table keys: ' + Object.keys(counts).length);
        var fileversion = Math.floor(Math.random() * 100000);
        var jsonfilename = __dirname + self.filename + '.' + fileversion + '.json'
        H.log('About to save word count table in : ' + jsonfilename);
        jsonfile.writeFile(jsonfilename, counts, { spaces: 2 }, function(err) {
          console.error('Error was ' + err);
        })
        H.log('Word count table saved in : ' + jsonfilename);
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