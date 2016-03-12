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

var parse = JSON2.parse;
var log = console.log;
var dump = function(t) { log(stringify(t)); }

  describe('In a trie', function() {
    describe('method PUT', function() {
      it('can insert a single-char key at the top', function() {
        expect(stringify(TRIE.put('s', 0))).to.be.equal('{"s":{"VAL":0}}');
      });
      it('can insert a three-char key at the top', function() {
        expect(stringify(TRIE.put('she', 1))).to.be.equal('{"s":{"h":{"e":{"VAL":1}}}}');
      });
      it('can insert two keys at the top', function() {
        var trie = TRIE.put('s', 0);
        expect(stringify(TRIE.put('h', 1, trie))).to.be.equal('{"s":{"VAL":0},"h":{"VAL":1}}');
      });
      it('can overwrite a single-char key at the top', function() {
        var trie = TRIE.put('s', 0);
        expect(stringify(TRIE.put('s', 1, trie))).to.be.equal('{"s":{"VAL":1}}');
      });
      it('can overwrite a single-char deep down the tree', function() {
        var trie = TRIE.put('she', 0);
        expect(stringify(TRIE.put('she', 1, trie))).to.be.equal('{"s":{"h":{"e":{"VAL":1}}}}');
      });
      it('can insert two keys deep down the trie', function() {
        var trie = TRIE.put('she', 0);
        expect(stringify(TRIE.put('sha', 1, trie))).to.be.equal('{"s":{"h":{"e":{"VAL":0},"a":{"VAL":1}}}}');
      });
      it('can modify a key using a given function', function() {
        var incr = function(x) { return x + 1; };
        var trie = TRIE.put('she', 0);
        expect(stringify(TRIE.put('she', incr, trie))).to.be.equal('{"s":{"h":{"e":{"VAL":1}}}}');
      });
      it.only('can start and increment the tree using the same function', function() {
        var incr = function(x) { return x + 1; };
        incr.startValue = 0;
        var trie = TRIE.put('she', incr);
        expect(stringify(TRIE.put('she', incr, trie))).to.be.equal('{"s":{"h":{"e":{"VAL":1}}}}');
      });
    });
    describe('method GET', function() {
      it('can retrieve the value for a single-char key at the top', function() {
        var trie = TRIE.put('s', 0);
        expect(TRIE.get('s', trie)).to.be.equal(0);
      });
      it('can retrieve the value for a two-char key at the top', function() {
        var trie = TRIE.put('sh', 1);
        expect(TRIE.get('sh', trie)).to.be.equal(1);
      });
      it('can retrieve values for keys deep down the trie', function() {
        var trie = TRIE.put('she', 0);
        trie = TRIE.put('sha', 1, trie);
        expect(TRIE.get('she', trie)).to.be.equal(0);
        expect(TRIE.get('sha', trie)).to.be.equal(1);
      });
      it('can retrieve a value halfway a subtree', function() {
        var trie = TRIE.put('she', 0);
        trie = TRIE.put('shells', 1, trie);
        expect(TRIE.get('she', trie)).to.be.equal(0);
        expect(TRIE.get('shells', trie)).to.be.equal(1);
      });
      it('can retrieve keys halfway a subtree', function() {
        var trie = TRIE.put('she', 0);
        trie = TRIE.put('shells', 1, trie);
        trie = TRIE.put('shellstruck', 2, trie);
        trie = TRIE.put('shellstrack', 3, trie);
        trie = TRIE.put('shellstragedy', 44, trie);
        expect(TRIE.get('she', trie)).to.be.equal(0);
        expect(TRIE.get('shells', trie)).to.be.equal(1);
        expect(TRIE.get('shellstruck', trie)).to.be.equal(2);
        expect(TRIE.get('shellstrack', trie)).to.be.equal(3);
        expect(TRIE.get('shellstragedy', trie)).to.be.equal(44);
      });
      it('can produce pretty complex tries', function() {
        var trie = TRIE.put('she', 0);
        trie = TRIE.put('sells', 1, trie);
        trie = TRIE.put('sea', 2, trie);
        trie = TRIE.put('shells', 3, trie);
        trie = TRIE.put('by', 4, trie);
        trie = TRIE.put('the', 5, trie);
        trie = TRIE.put('sea', 6, trie);
        trie = TRIE.put('shore', 7, trie);
        trie = TRIE.put('and', 8, trie);
        trie = TRIE.put('seagulls', 9, trie);
        expect(TRIE.get('she', trie)).to.be.equal(0);
        expect(TRIE.get('sells', trie)).to.be.equal(1);
        expect(TRIE.get('sea', trie)).to.be.equal(6);
        expect(TRIE.get('shells', trie)).to.be.equal(3);
        expect(TRIE.get('by', trie)).to.be.equal(4);
        expect(TRIE.get('the', trie)).to.be.equal(5);
        expect(TRIE.get('shore', trie)).to.be.equal(7);
        expect(TRIE.get('and', trie)).to.be.equal(8);
        expect(TRIE.get('seagulls', trie)).to.be.equal(9);
      });
      xit('can modify a key using a given function', function() {
        var incr = function(x) { return x + 1; };
        var trie = TRIE.put('she', 0);
        trie = TRIE.put('sells', incr, trie);
        trie = TRIE.put('sea', incr, trie);
        trie = TRIE.put('shells', incr, trie);
        trie = TRIE.put('by', incr, trie);
        trie = TRIE.put('the', incr, trie);
        trie = TRIE.put('sea', incr, trie);
        trie = TRIE.put('shore', incr, trie);
        trie = TRIE.put('sells', incr, trie);
        trie = TRIE.put('sea', incr, trie);
        trie = TRIE.put('shells', incr, trie);
        expect(TRIE.get('she', trie)).to.be.equal(0);
        expect(TRIE.get('sells', trie)).to.be.equal(1);
        expect(TRIE.get('sea', trie)).to.be.equal(6);
        expect(TRIE.get('shells', trie)).to.be.equal(3);
        expect(TRIE.get('by', trie)).to.be.equal(4);
        expect(TRIE.get('the', trie)).to.be.equal(5);
        expect(TRIE.get('shore', trie)).to.be.equal(7);
      });
    });
    describe('method SIZE', function() {
      it('can count one for a single-char key at the top', function() {
        var trie = TRIE.put('s', 0);
        expect(TRIE.size(trie)).to.be.equal(1);
      });
      it('counts still one for a three-char key', function() {
        var trie = TRIE.put('she', 0);
        expect(TRIE.size(trie)).to.be.equal(1);
      });
      it('can count two for a two-key trie', function() {
        var trie = TRIE.put('she', 0);
        expect(TRIE.size(TRIE.put('sha', 1, trie))).to.be.equal(2);
      });
      it('can count a lot for a larger trie', function() {
        var trie = TRIE.put('she', 0);
        trie = TRIE.put('sells', 1, trie);
        trie = TRIE.put('sea', 2, trie);
        trie = TRIE.put('shells', 3, trie);
        trie = TRIE.put('by', 4, trie);
        trie = TRIE.put('the', 5, trie);
        trie = TRIE.put('sea', 6, trie);
        trie = TRIE.put('shore', 7, trie);
        expect(TRIE.size(trie)).to.be.equal(7);
      });
    });
  });
})();