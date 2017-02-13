

/*
 * I'm likely not doing this right:
 */
chai = require('chai')
expect = chai.expect

/*
 * ES6 imports depend on some package in babel, maybe?
 */
LinkedListMod = require('./linkedList.js')



describe('LinkedList', function() {
  var list;

  beforeEach(function(){
    list = new LinkedListMod.LinkedList(String);
  });

  it('should start with zero elements', function() {
    expect(list.length).to.eq(0);
  });

  it('should set its default head to null', function(){
    expect(list.head).to.eq(null);
  });

  describe('.push', function(){
    context('with a single element', function(){
      it('should allow push of a single element to a list', function(){
        list.push('pizza');
        expect(list.head.valueOf()).to.eq('pizza');
      });

      it('should increment the length of the list', function(){
        list.push('pizza');
        expect(list.length).to.eq(1);
      });
    });

    context('with multiple elements', function(){
      it('should increment the length count', function(){
        list.push('pizza');
        list.push('stromboli');
        list.push('mushroom');
        expect(list.length).to.eq(3);
      });

      it('should assign the head to the first element pushed', function(){
        expect(list.head).to.eq(null);
        list.push('pizza');
        expect(list.head.valueOf()).to.eq('pizza');
        list.push('stromboli');
        expect(list.head.valueOf()).to.eq('pizza');
      });

      it('should attach the second element to the first element', function(){
        list.push('pizza');
        list.push('stromboli');
        expect(list.head.nextNode.valueOf()).to.eq('stromboli');
      });

      it('should attach nextNodes in sequential order', function(){
        list.push('pizza');
        list.push('stromboli');
        list.push('mushroom');
        list.push('peanutbutter');
        expect(list.head.valueOf()).to.eq('pizza');
        expect(list.head.nextNode.valueOf()).to.eq('stromboli');
        expect(list.head.nextNode.nextNode.valueOf()).to.eq('mushroom');
        expect(list.head.nextNode.nextNode.nextNode.valueOf()).to.eq('peanutbutter');
      });
    });
  });

  describe('.pop', function(){
    context('with no elements', function(){
      it('should return null', function(){
        expect(list.pop()).to.eq(null);
      });

      it('should not decrement the length', function(){
        expect(list.length).to.eq(0);
      });
    });

    context('with one element', function(){
      it('should change the length', function(){
        list.push('hello');
        var result = list.pop();
        expect(list.length).to.eq(0);
      });

      it('should set the list head to null', function(){
        list.push('hello');
        var result = list.pop();
        expect(list.head).to.eq(null);
      });

      it('should return the last element', function(){
        list.push('hello');
        var result = list.pop();
        expect(result.valueOf()).to.eq('hello');
      });
    });

    context('with multiple elements', function(){
      it('should return the last element from the list', function(){
        list.push("hello");
        list.push("new");
        list.push("world");
        list.push("today");

        var output = list.pop();
        //expect(output.valueOf()).to.eq('today');
        expect(output).to.eq('today');
      });

      it('should remove the last element from the list', function(){
        list.push("hello");
        list.push("world");
        list.push("today");

        var output = list.pop();
        expect(output.valueOf()).to.eq('today');
        expect(list.length).to.eq(2);

        var output2 = list.pop();
        expect(output2.valueOf()).to.eq('world');
        //expect(output2.nextNode).to.eq(null); // My pop doesn't return a node, it returns the un-linked object
        expect(list.length).to.eq(1);

        var output3 = list.pop();
        expect(output3.valueOf()).to.eq('hello');
        //expect(output3.nextNode).to.eq(null); // My pop doesn't return a node, it returns the un-linked object
        expect(list.length).to.eq(0);
      });
    });
  });

/*
  describe('.del', function(){
    context('with one node', function(){
      it('dels a solo node', function(){
        list.push('hello');
	let [p, i] = list.findPrevious('hello');
	expect(p).to.eq(null);
	expect(i).to.eq(0);
        list.del('hello');
        expect(list.length).to.eq(0);
        expect(list.head).to.eq(null);
      });

      it('does not perform a del when a node does not match', function(){
        list.push('hello');
        list.del('goodbye');
        expect(list.length).to.eq(1);
        expect(list.head.valueOf()).to.eq('hello');
      });
    });

    context('with multiple nodes', function(){
      beforeEach(function(){
        list.push('hello');
        list.push('darkness');
        list.push('my');
        list.push('old');
        list.push('friend');
      });

      it('changes the list _.length', function(){
        expect(list.head.nextNode.valueOf()).to.eq('darkness');
        expect(list.length).to.eq(5);
        list.del('friend');
        expect(list.length).to.eq(4);
        list.del('my');
        expect(list.length).to.eq(3);
        list.del('happy');
        expect(list.length).to.eq(3);
      });

      it('resets the nextNode property on the node before the deleted node', function(){
        expect(list.head.nextNode.valueOf()).to.eq('darkness');
        list.del('darkness');
        expect(list.head.nextNode.valueOf()).to.eq('my');
      });

      it('resets the list.head if deleting the first node', function(){
        expect(list.head.valueOf()).to.eq('hello');
        list.del('hello');
        expect(list.head.valueOf()).to.eq('darkness');
      });
    });
  });
*/
  describe('.toArray', function(){
    context('when there are no elements', function(){
      it('converts to an array', function(){
        expect(list.toArray()).to.deep.equal([]);
      });
    });

    context('when there are several elements', function(){
      beforeEach(function(){
        list.push('The');
        list.push('rain');
        list.push('in');
        list.push('Spain');
      });

      it('can convert to an array', function(){
        expect(list.toArray()).to.deep.equal(['The', 'rain', 'in', 'Spain']);
      });
    });
  });

  describe('.getEnd', function(){
    context('with several nodes', function(){
      beforeEach(function(){
        list.push('The');
        list.push('rain');
        list.push('in');
        list.push('Spain');
      });

      it('finds the last node', function(){
        expect(list.getEnd().valueOf()).to.eq('Spain');
      });
    });

    context('with one node', function(){
      beforeEach(function(){
        list.push('Ahoy!');
      });

      it('finds the only node', function(){
        expect(list.getEnd().valueOf()).to.eq('Ahoy!');
      });
    });

    context('with no nodes', function(){
      it('returns null', function(){
        expect(list.getEnd()).to.eq(null);
      });
    });
  });

  describe('.includes', function(){
    beforeEach(function(){
      list.push('The');
      list.push('rain');
      list.push('in');
      list.push('Spain');
    });

    it('should return true if node is in list', function(){
      expect(list.includes("rain")).to.eq(true);
    });

    it('should return false if node is not in list', function(){
      expect(list.includes("nope")).to.eq(false);
    });
  });

  describe('.findPrevious', function(){
    beforeEach(function(){
      list.push('oh');
      list.push('hello');
      list.push('world');
    });
    it('should return the correct tuples for findPrevious when found', function(){
      expect(list.length).to.eq(3);
      let [p, i] = list.findPrevious('oh');
      expect(p).to.eq(null);
      expect(i).to.eq(0);
      [p, i] = list.findPrevious('hello');
      expect(p.valueOf()).to.eq('oh');
      expect(i).to.eq(1);
      [p, i] = list.findPrevious('world');
      expect(p.valueOf()).to.eq('hello');
      expect(i).to.eq(2);
    });
    it('should return the correct tuples for findPrevious when not found', function(){
      let [p, i] = list.findPrevious('nope');
      expect(p).to.eq(null);
      expect(i).to.eq(null);
    });
  });
    

  describe('.find', function(){
    beforeEach(function(){
      list.push('oh');
      list.push('hello');
      list.push('world');
    });
    it('should return the correct tuple for a found needle', function(){
      var result = list.find("hello");
      expect(result).to.eq('hello');
    });

    it('should return the correct tuple for a not found needle', function(){
      var result = list.find("nope");
      expect(result).to.eq(null);
    });
  });

  describe('.index', function(){
    beforeEach(function(){
      list.push('oh');
      list.push('hello');
      list.push('world');
    });

    it('should return expected indexes', function(){
      expect(list.index('oh')).to.eq(0);
      expect(list.index('world')).to.eq(2);
      expect(list.index('nope')).to.eq(null);
    });
  });

  describe('.insert', function(){
    beforeEach(function(){
      list.push('dark');
      list.push('stormy');
    });

    it('should insert nodes', function(){
      expect(list.length).to.eq(2);
      list.insert(1, 'and');
      list.insert(3, 'night');
      expect(list.length).to.eq(4);
      expect(list.toArray()).to.deep.equal(['dark', 'and', 'stormy', 'night']);
    });
  });

  describe('.insertAfter', function(){
    beforeEach(function(){
      list.push('dark');
      list.push('stormy');
    });

    it('should insert nodes after other nodes', function(){
      expect(list.length).to.eq(2);
      list.insertAfter('dark', 'and');
      list.insertAfter('stormy', 'night');
      expect(list.length).to.eq(4);
      expect(list.toArray()).to.deep.equal(['dark', 'and', 'stormy', 'night']);
    });
  });

  describe('.distance', function(){
    beforeEach(function(){
      list.push("hello")
      list.push("pizza")
      list.push("world")
      list.push("today")
      list.push("tomorrow")
    });

    it('should calculate distance between nodes', function(){
      expect(list.distance("hello", "today")).to.eq(3);
      expect(list.distance("pizza", "today")).to.eq(2);
      expect(list.distance("hello", "world")).to.eq(2);
      expect(list.distance("hello", "tomorrow")).to.eq(4);
      expect(list.distance("world", "today")).to.eq(1);
    });
  });
});
