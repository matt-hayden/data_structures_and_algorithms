
var fs = require('fs')

class Node {
/***
 *** I'm a simple class with no required properties
 ***	If I have _weight, then I'm a leaf node (but may still have children)
 ***	If I have children, they exist as properties with values of Node
 ***/
	constructor(count) {
		this._count = count || 0
	}
	isLeaf() { return (this.hasOwnProperty('_weight')) }
	*descend(prefix='') {
		var popular_items = []
		for (var k in this) if (!(k.startsWith('_')))
			popular_items.push([1e6-this[k]._count, k])
		for (var [r, k] of popular_items.sort()) {
			if (k.startsWith('_')) continue
			var p = prefix+k
			var n = this[k]
			if (n.isLeaf()) yield p
			yield* n.descend(p)
		}
	}
}
class Trie {
/***
 *** I'm a simple class that recursively adds the contents of strings into
 *** nested objects. 
 ***/
	constructor(filename) {
		this.head = new Node()
		if (filename) this.addFile(filename)
	}
	add(iterable, weight, splitter=fancyLetterSplitter) {
		var nb = this.head
		for (var c of splitter(iterable)) {
			if (!(c in nb)) nb[c] = new Node()
			nb[c]._count++
			nb = nb[c]
		}
		nb._weight = weight || 1
	}
	addFile(filename, weight) {
		for (var line of (fs.readFileSync(filename)+'').split('\n')) {
			if (line.length) this.add(line, weight || 1)
		}
	}
}
Trie.prototype[Symbol.iterator] = function* () {
	yield* this.head.descend()
}

function* fancyLetterSplitter(word) {
/***
 *** An inessential function:
 ***	The unfancy function to split a word into it's letters:
		he'll -> [ 'h', 'e', '\'', 'l', 'l' ]
 ***	This function:
		he'll -> [ 'h', 'e', '\'ll' ]
 *** Since 'll is a valid word, but 'qq and 'xx are not, this generator
 *** will sometimes produce a shorter sequence of ways to split a word.
 *** This will result in a shorter lexical tree for a small number of words,
 *** and save a little memory.
 ***/
	if (word.len <= 3) return word
	prefixes = [ "L'", "O'", "d'" ]
	beginnings = [ 'anti', 'com', 'con', 'count', 'dis', 'elect', 'inter', 'Mar', 'over', 'pro', 'qu', 're', 'sta', 'stra', 'sub', 'super', 'trans', 'un', ]
	suffixes = [ "'d", "'ll", "'m", "'re", "'s", "'ve", "n't", 'ed', 'er', 'ing', 'ings', 'sion', 'tion' ]
	ending = ''
	for (let p of prefixes) {
		if (word.startsWith(p)) {
			yield p
			word = word.slice(p.length)
			break
		}
	}
	for (let b of beginnings) {
		if (word.startsWith(b)) {
			yield b
			word = word.slice(b.length)
			break
		}
	}
	for (let s of suffixes) {
		if (word.endsWith(s)) {
			ending = s
			word = word.slice(0, word.length-ending.length)
			break
		}
	}
	yield* word
	if (ending.length) yield ending
}
