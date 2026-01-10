import bcrypt from "bcrypt";

const salt = await bcrypt.genSalt(10);
console.log(salt);

const hashedPwd = await bcrypt.hash("myPassword", 10);
console.log(hashedPwd);

// Verify
// const savedSalt = hashedPwd.substring(0, 29);
// const newHashedPwd = await bcrypt.hash("myPassword", savedSalt);
// console.log(newHashedPwd);
// console.log(hashedPwd === newHashedPwd);

const isSame = await bcrypt.compare("myPassword", hashedPwd);
console.log(isSame);
