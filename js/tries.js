/*jshint asi: true, expr: true */
var JSON2 = require('JSON2');
var stringify = JSON2.stringify;
var parse = JSON2.parse;
var log = console.log;
var dump = function(t) { log(stringify(t)); }

var code = function() {

  function get(key, trie) {
    var result = null;
    var arra = key.split('');
    var _char = arra.shift();
    var type = typeof trie[_char];
    if (arra.length === 0) {
      result = (trie[_char] && !undef(trie[_char].VAL))
        ? trie[_char].VAL : null;
      return result;
    }
    if (!undef(type)) {
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
    if (undef(_trie[_char])) {
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
  
  function size(trie) {
    var result = {val:0};
    _size(trie, result);
    return result.val;
    function _size(trie, curSize) {
      dump(trie);
      dump(curSize)
      if (hasValue(trie)) {
        log('++'+curSize.val)
        curSize.val++;
      }
      var keys = trieKeys(trie);
      if (keys.length > 0) {
        keys.forEach(function(key) {
          _size(trie[key], curSize);
        });
      }
      //return curSize;
    }
  }
  
  return {
    put: put,
    get: get,
    size: size
  }
  
  function trieKeys(trie) {
    return Object.keys(trie).filter(function(k) {
      return k !== 'VAL';
    });
  }
  function hasValue(node) {
    return !hasNoValue(node);
  }
  function hasNoValue(node) {
    return undef(node.VAL);
  }
  function def(val) {
    return !undef(val);
  }
  function undef(val) {
    return (typeof val === 'undefined');
  }
}();

if (typeof module === 'object' && typeof module.exports !== 'undefined') {
    module.exports = {
        TRIE : code
    }
}