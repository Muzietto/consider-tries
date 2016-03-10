/*jshint asi: true, expr: true */
var JSON2 = require('JSON2');
var stringify = JSON2.stringify;
var parse = JSON2.parse;
var log = console.log;

var code = function() {

  function get(key, trie) {
    var result = null;
    var arra = key.split('');
    var _char = arra.shift();
    var type = typeof trie[_char];
    if (arra.length === 0) {
      result = (trie[_char] && !undefined(trie[_char].VAL))
        ? trie[_char].VAL : null;
      return result;
    }
    if (!undefined(type)) {
      if (!trie[_char].VAL) {
        result = get(arra.join(''), trie[_char]);
      } else { 
        result = trie[_char].VAL;
      }
    }
    return result;
  }

  function put(key, value, trie) {
    trie = trie || {};
    var _trie = parse(stringify(trie));
    var arra = key.split('');
    if (arra.length === 1) {
      _trie[key] = { VAL: newVal(_trie[key]) };
      return _trie;
    }
    var _char = arra.shift();
    if (undefined(_trie[_char])) {
      _trie[_char] = put(arra.join(''), value, {});
    } else {
      _trie[_char] = put(arra.join(''), value, _trie[_char]);
    }
    return _trie;

    function newVal(node) {
      var newVal = value;
      if (typeof value === 'function') {
        try {
          newVal = value(node['VAL']);
        } catch (exc) {
          newVal = undefined;
        }
      } 
      return newVal; 
    }
  }
  return {
    put: put,
    get: get
  }
  
  function undefined(val) {
    return (typeof val === 'undefined');
  }
}();

if (typeof module === 'object' && typeof module.exports !== 'undefined') {
    module.exports = {
        TRIE : code
    }
}