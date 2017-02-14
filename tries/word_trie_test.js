
t = new Trie('british-english')

console.log("The lookup begins with the following entries:")

var c = 50
var n = 0
for (var word of t) {
	n++
	if (0 < c--) console.log(word)
}
console.log(`${n} words read into tree from regular dictionary`)

t.addFile('custom', 10)

console.log("The lookup ends with the following entries:")

let b = n
n = 0
for (var word of t) {
	n++
	if (b-- < 50) console.log(word)
}

console.log(`${n} total words after adding custom dictionary`)

console.log("The words are considered to start with the following:")
var popular_items = []
console.log(Object.getOwnPropertyNames(t.head).join(' '))
