describe('ListNode', function() {
  it('should have a data property', function(){
    var node = new ListNode();
    expect(node).to.have.property('data');
  });

   it('should have data', function() {
     var node = new ListNode('info');
     expect(node.data).to.eq('info');
     var pizzaNode = new ListNode('pizza');
     expect(pizzaNode.data).to.eq('pizza');
   });

   it('should have a default empty next', function() {
     var node = new ListNode('pizza');
     expect(node.next).to.eq(null);
   });

   it('should allow setting a next', function() {
     var n1 = new ListNode('pizza');
     var n2 = new ListNode('cats');
     n1.next = n2;
     expect(n1.next.data).to.eq('cats');
     expect(n1.next instanceof ListNode).to.be.true;
   });

   it('should allow a next node argument on creation', function(){
     var node = new ListNode('pizza', new ListNode('cats'));
     expect(node.next.data).to.eq('cats');
     expect(node.next instanceof ListNode).to.be.true;
   });
});
