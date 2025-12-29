import "./db.js";
import User from "./UserModel.js";

const user = await User.findOne({ email: "alpha@gmail.com" }).populate({
  path: "parentId",
  select: "name age -_id",
});

console.log(user);
