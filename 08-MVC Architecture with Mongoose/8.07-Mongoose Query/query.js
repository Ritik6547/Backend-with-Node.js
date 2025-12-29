import User from "./models/UserModel.js";

const query = User.find({ age: { $gte: 12 } });

query.select("name age").sort({ age: -1 });

console.log(query.projection());
console.log(query.getQuery());

// const data = await query.exec();
const data = await query;
console.log(data);
