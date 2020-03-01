function add(x, y) {
  return new Promise((resolve) => resolve(x + y));
}

test("should add",  function(done){
   add(2,5).then( (sum)=>{
     expect(sum).toBe(7);
     done();
   })
})
