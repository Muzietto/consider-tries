# consider-tries
Indexing [a whole book](https://github.com/Muzietto/consider-tries/blob/master/doc/ConsiderPhlebas.txt) in a trie, and comparing search times with those in a plain JS object.

There are approximately 11.000 keys. Search times come out as follows:

NUM.SEARCHES | SEARCH TIME IN TRIE | SEARCH TIME IN OBJECT 
-------------|---------------------|-----------------------
100|0,008s|0,006s     
1.000|0,059s|0,065s     
10.000|0,583s|0,667s     
100.000|5,718s|6,576s     
1.000.000|56,525s|65,43s     
10.000.000|563s|out-of-memory error  

![alt image](/img/IMB-Consider-Phlebas-Mark-Salwowski-Art.jpg)

-------------
0) clone the repo

1) npm install

2) mocha spec/*.js --watch

Test file spec/tries_test_COMPARISON_TESTS.js is the only one immediately executable.

In order to run the other tests, it is first necessary to remove the keyword "only" from the comparison test file.
