var  request= require("supertest");
var app= require("../src/app");
var task= require("../models/task");
var {userID, token , task2,newUser,setUpDB}= require("./fixtures/db");
beforeEach(setUpDB);

test("should create a task" ,  async () =>{
    var response=    await request(app)
              .post("/tasks")
              .set('Authorization', newUser.tokens[0].token.toString())
              .send({task:"study mathematics"})
              .expect(200);
      var Task = await task.findById(response.body._id);
      await  expect(Task).not.toBeNull();
      await expect(Task.accomplished).toBe(false);
})

test("should get the differenet tasks" , async() =>  {
    var response = await request(app)
                   .get("/tasks")
                   .set('Authorization', newUser.tokens[0].token.toString())
                   .expect(200)
   await  expect(response.body.length).toEqual(1)
})

test("should reject users deleting other users", async () => {
   var response= await request(app)
                       .delete("/tasks/${task2._id}")
                       .set('Authorization', newUser.tokens[0].token.toString())
                       .expect(404);

   var Task= task.findById(task2._id);
    expect(Task).not.toBe(null);


});
