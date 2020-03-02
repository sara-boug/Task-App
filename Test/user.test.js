var  request= require("supertest");
var app= require("../src/app");
var user= require("../models/user");
var {userID, token , newUser, setUpDB}= require("./fixtures/db");
beforeEach(setUpDB);

test("should creat new user", async() =>  {
  var response=  await request(app).post("/users").send({
    name:"sar",
    email:"sarab@gmail.com",
    password:"MApass7777!"
  }).expect(200);

  var User=  await user.findById(response.body.user._id);
  expect(User).not.toBeNull();
  await  expect(response.body).toMatchObject({
    user:{
      name:"sar",
      email:"sarab@gmail.com"
    },
    token:User.tokens[0].token

  });
  expect(User.password).not.toBe("MApass7777!");
});


test("Should login user", async() =>  {
  var response=  await request(app).post("/users/login").send({
    email:newUser.email,
    password:newUser.password
  }).expect(200)
  await expect(response).not.toBeNull();
  var User= await user.findById(response.body.user._id);
  await expect(User).not.toBeNull();
  await   expect(response.body.token).toBe(User.tokens[1].token)

});

test("should not login user", async() => {
  await request(app).post("/users/login").send({
    email:newUser.email,
    password:"1111ytqs"
  }).expect(400);

});

test("should get the user profile", async () => {
  await request(app).get("/users/me")
  .set('Authorization', newUser.tokens[0].token.toString())
  .send()
  .expect(200)
});

test("should reject non auth users", async () => {
  await request(app).get("/users/me")
  .send()
  .expect(500)
});


test("should update  the user avatar" , async () => {
  var response=  await  request(app).post("/users/me/avatar")
          .set('Authorization', newUser.tokens[0].token.toString())
          .attach( "upload","Test/fixtures/239791aa7eaee867743b065dc3d3ffb7.jpg")
          .expect(200);
  var User= await user.findById(userID);
  expect(User.avatar).toEqual(expect.any(Buffer));
 })

test("should update user", async () => {
    var response=await  request(app)
        .patch("/users/me")
        .set('Authorization', newUser.tokens[0].token.toString())
        .send({name:"Radja"})
        .expect(200);
   var User = await user.findById(userID);
  await expect(response.body.name).toBe(User.name);

});

test("should reject updating invalid fields", async () => {
    var response=await  request(app)
        .patch("/users/me")
        .set('Authorization', newUser.tokens[0].token.toString())
        .send({location:"Algeria"})
        .expect(500);

});

test("should delete user" , async() => {
  var response =await request(app).delete("/users/me")
  .set('Authorization', newUser.tokens[0].token.toString())
  .send()
  .expect(200);
  expect(response.body).not.toBeNull();
  var User= await  user.findById(response.body._id);
  await expect(User).toBeNull();

});

test("should delete user" , async() => {
  await request(app).delete("/users/me")
  .send()
  .expect(500)
});
