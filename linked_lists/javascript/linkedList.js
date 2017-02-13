
/***
 *** global constants
 ***/


class ReplicaOfArray {
/***
 *** Some replicas of the functionality of the Array class
 *** This depends on iterator functionality implemented in a subclass
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
	*entries() {
		let n = 0
		for (let v of this)
			yield [n++, v]
	}
/***
 *** functional programming found in the Array class
 ***/
	*map(fn, this_arg) {
	/*
	 * I return TWO arguments to the callback fn, not THREE like Array.map
	 */
		let c = 0
		for (let v of this) {
			// c++ here runs fn(v, c), and THEN evaluates c=c+1
			yield fn(v, c++)
		}
	}
	forEach(fn, this_arg) {
	/*
	 * I return TWO arguments to the callback fn, not THREE like Array.forEach
	 */
		let c = 0
		for (let v of this) {
			// c++ here runs fn(v, c), and THEN evaluates c=c+1
			void fn(v, c++) // the void statement ignores any output from fn(), as specified by the JavaScript standard, but can be ignored
		}
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
		for (let v of this) {
			// c++ here runs fn(v, c), and THEN evaluates c=c+1
			if (fn(v, c++)) yield v
		}
	}
	reduce(fn, init) {
	/*
	 * I return THREE arguments to the callback fn, not FOUR like Array.reduce
	 */
		let c = 0
		let lv = init
		for (let v of this) {
			// c++ here runs fn(lv, v, c), and THEN evaluates c=c+1
			lv = fn(lv, v, c++)
		}
		return lv
	}
	includes(arg) {
		return this.some((x)=>(arg==x))
	}
}

class LinkedList extends ReplicaOfArray {
/***
 ***
 ***/
	constructor(factory, head) {
		super()
		this.factory = factory || ListNode
		this.head = head || null
	}
	toString() {
		return this.toArray().join(' -> ')
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
	 *** I return a tuple, [previousNode, index] where (previousNode.nextNode.valueOf() == needle)
	 *** or [null, 0] if at the head of the list
	 *** If needle is not found, return the tail of the linked list.
	 *** 
	 *** This function is quite useful elsewhere, most often followed by:
		if (i == null) { do something because it's not found }
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
		let [p, i] = this.findPrevious(...args)
		return i
	}
	insert(pos, ...args) {
		let c = 0
		let tn = this.head
		let newNode = new this.factory(...args)
		// Corner case
		if (pos == 0) {
			newNode.nextNode = tn
			this.head = newNode
		}
		newNode.nextNode = null
		// Get the previous index and node. This could be a seperate method
		for (let i = 0; i < pos-1; i++) {
			if (tn) tn = tn.nextNode
			else return false
		}
		newNode.nextNode = tn.nextNode // could be null
		tn.nextNode = newNode
		return true
	}
	insertAfter(needle, ...args) {
		let [p, i] = this.findPrevious(needle)
		if (i == null) return false // needle not found
		let matchingNode = (p) ? p.nextNode : this.head
		let newNode = new this.factory(...args)
		newNode.nextNode = matchingNode.nextNode
		matchingNode.nextNode = newNode
		return i
	}
		
	distance(left_arg, right_arg) {
		let [p, i] = this.findPrevious(left_arg)
		if (i == null) return false // not found
		// I build a brand-new linked list, starting at the first match of arg.
		// Of course, I don't have to do this if the left arg happens to be the head
		// of this LinkedList.
		if (p)
			[p, i] = new LinkedList(this.factory, p.nextNode).findPrevious(right_arg)
		else
			[p, i] = this.findPrevious(right_arg)
		// the new index is the distance from the LinkedList with head at left_arg, to the match at right arg
		return i
	}
}

/***
 *** This is an important definition for the Linked List type. It enables the
 *** acceleration `for (var v of this)` in functions above
 ***/
LinkedList.prototype[Symbol.iterator] = function* () {
	let tn = this.head
	while (tn) {
		yield tn.valueOf()
		tn = tn.nextNode
	}
}

module.exports = { LinkedList }
