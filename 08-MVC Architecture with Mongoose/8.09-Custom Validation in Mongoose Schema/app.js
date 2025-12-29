import "./db.js";
import User from "./UserModel.js";

const data = await User.create({
  name: "test",
  age: 80,
  email: "test@gmail.com",
});

console.log(data);
