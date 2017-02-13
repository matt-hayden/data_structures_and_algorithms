

class ReplicaOfArray {
/***
 *** This class is not used by itself. It compartmentalized my own replicas
 *** of the functionality of the built-in Array class. These are very basic
 *** methods. You can INHERIT from ReplicaOfArray into your own classes, it
 *** doesn't rely on LinkedList, but it does depend on iterator functionality
 *** implemented fancily below.
 ***/
	toArray() {
		let r = []
		for (let v of this) r.push(v)
		return r
	}
	get length() {
		let n = 0
		for (let v of this) n++
		return n
	}
	/***
	 *** A-HA! A generator function. It uses yield instead of return, and can
	 *** call yield multiple times.
	 *** But, note that .entries() is not an official part of ES6
	 ***/
	*entries() {
		let n = 0
		for (let v of this) yield [n++, v]
	}
	includes(needle) { return this.some((x)=>(needle==x)) }
/***
 *** FUNCTIONAL PROGRAMMING found in the Array class
 ***/
	*map(fn, this_arg) {
	/*
	 * I return TWO arguments to the callback fn, not THREE like Array.map
	 */
		let c = 0
		// c++ here runs fn(v, c), and THEN evaluates c=c+1
		for (let v of this) yield fn(v, c++)
	}
	forEach(fn, this_arg) {
	/*
	 * I return TWO arguments to the callback fn, not THREE like Array.forEach
	 */
		let c = 0
		// The void statement ignores any output from fn(), as specified
		// by the JavaScript standard, but can be ignored.
		// c++ here runs fn(v, c), and THEN evaluates c=c+1
		for (let v of this) void fn(v, c++)
	}
	every(fn, this_arg) {
		if (this.head) {
			for (var v of this) if (!fn(v)) return false
			return true
		}
	}
	some(fn) {
		if (this.head) {
			for (var v of this) if (fn(v)) return true
			return false
		}
	}
	*filter(fn, this_arg) {
	/*
	 * I return TWO arguments to the callback fn, not THREE like Array.filter
	 */
		let c = 0
		// c++ here runs fn(v, c), and THEN evaluates c=c+1
		for (let v of this) if (fn(v, c++)) yield v
	}
	reduce(fn, init) {
	/*
	 * I return THREE arguments to the callback fn, not FOUR like Array.reduce
	 */
		let c = 0
		let lv = init
		// c++ here runs fn(lv, v, c), and THEN evaluates c=c+1
		for (let v of this) lv = fn(lv, v, c++)
		return lv
	}
}

class LinkedList extends ReplicaOfArray {
/***
 *** I'm a class encapsulating a linked list. I DO NOT need a ListNode object, but
 *** I'll work with one. 
 ***/
	constructor(factory, head) {
		// factory can be a ListNode, but JavaScript allows me to use regular
		// strings, which is what the test suite expects. In the wild, usually
		// an object. I utilize the .nextNode member, which is hardcoded.
		super() // Don't worry about this too much. It's required because I'm
			// INHERITING from another class. You can tell I'm inheriting
			// because this class has `extends ReplicaOfArray' above.
		this.factory	= factory	|| ListNode
		this.head	= head		|| null
	}
/***
 *** Core methods, these look the same as textbook linked list algorithms 
 ***/
	getEnd() { // returns a Node object
		let ln = null
		let tn = this.head
		while (tn) {
			ln = tn
			tn = tn.nextNode
		}
		return ln
	}
	concat(other_linked_list) {
	/*
	 * Unlike Array.concat, I do change the left-hand object
	 */
		return (this.getEnd().nextNode = other_linked_list.head)
	}
	push(...args) { // only one argument, unlike Array.push(..args)
	/*
	 * Unlike Array.push, I do not return the latest number of elements
	 */
		let newNode = new this.factory(...args)
		newNode.nextNode = null
		if (this.head) this.getEnd().nextNode = newNode
		else this.head = newNode
	}
	pop() {
		if (this.head) {
			let ln = null
			let tn = this.head
			while (tn.nextNode != null) {
				ln = tn
				tn = tn.nextNode
			}
			if (ln) ln.nextNode = null
			else this.head = null	
			return tn.valueOf()
		} else return null // undefined might be more appropriate, but the test asks for null
	}
	shift() {
		if (this.head) {
			let h = this.head
			this.head = h.nextNode // could be null
			return h.valueOf()
		}
	}
/***
 *** JavaScript utility methods, hinted in linkedList_test.js
 *** None of these are very textbook
 ***/
	findPrevious(needle, matcher=(a,b)=>{return (a==b)}, value_if_not_found=[null, null]) {
	/***
	 *** I return a tuple, [previousNode, index] where (previousNode.nextNode.valueOf() == needle),
	 *** or [null, 0] if its found at the head of the list
	 *** If needle is not found, return [null, null]
	 *** 
	 *** This function is quite useful elsewhere, most often followed by:
		if (i == null) { .. do something because it's not found .. }
		let matchingNode = (p) ? p.nextNode : this.head
	 ***
	 ***/
		let ln = null
		let tn = this.head
		let i = 0
		while (tn) {
			if (matcher(tn.valueOf(), needle)) return [ln, i]
			ln = tn
			tn = tn.nextNode
			i++
		}
		return value_if_not_found
	}
	find(...args) {
	/***
	 *** Not a very useful function. Takes the exact same arguments as findPrevious, as demonstrated
	 *** by the (...args) above and below
	 ***/
		let [p, i] = this.findPrevious(...args)
		if (i == null) return null // not found, undefined might be more appropriate, but tests say null
		let matchingNode = (p) ? p.nextNode : this.head
		return matchingNode.valueOf()
	}
/***
 *** Methods spelled out in linkedList_test.js
 ***
 *** Note that delete is a keyword, so I use the name del
 ***/
	del(...args) {
		let [previousNode, index] = this.findPrevious(...args)
		if (index == null) { // not found
			return false
		} else if (index == 0) { // head of list
			void this.shift()
		} else { // found in the middle or end of the list
			previousNode.nextNode = previousNode.nextNode.nextNode // could be null
		}
		return true
	}
	index(...args) {
		// I'm just a wrapper for the .findPrevious() method. It returns a previous
		// node and an index, but I'm just interested in the index
		return this.findPrevious(...args)[1]
	}
	insert(pos, ...args) {
		let c = 0
		let tn = this.head
		let newNode = new this.factory(...args)
		// Corner case
		if (pos == 0) {
			newNode.nextNode = tn
			this.head = newNode
			return true
		}
		newNode.nextNode = null
		// Get the (pos-1)th index and node.
		for (let i = 1; i < pos; i++) {
			if (!tn) return false
			tn = tn.nextNode
		}
		newNode.nextNode	= tn.nextNode // could be null
		tn.nextNode		= newNode
		return true
	}
	insertAfter(needle, ...args) {
		let [p, i] = this.findPrevious(needle)
		if (i == null) return false // needle not found
		let matchingNode	= (p) ? p.nextNode : this.head
		let newNode		= new this.factory(...args)
		newNode.nextNode	= matchingNode.nextNode
		matchingNode.nextNode	= newNode
		return i
	}
		
	distance(left_arg, right_arg) {
		let [p, i] = this.findPrevious(left_arg)
		if (i == null) return false // not found
		if (p) // the distance can be computed by chopping the linked list to start at left arg
			// I build a brand-new linked list, starting at the node matching left arg
			i = new LinkedList(this.factory, p.nextNode).index(right_arg)
		else // the distance between left and right equals the position of the right arg
			i = this.index(right_arg)
		// the new index is the distance from the LinkedList with head at left_arg, to the match at right arg
		return i
	}
}

/***
 *** This is an important definition for the Linked List type. It enables the
 *** acceleration `for (var v of this)` in functions above.
 *** The syntax is funny, and you won't see it very often.
 ***/
LinkedList.prototype[Symbol.iterator] = function* () {
	let tn = this.head
	while (tn) {
		yield tn.valueOf()
		tn = tn.nextNode
	}
}


module.exports = { LinkedList }
