import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$/,
    },
    password: {
      type: String,
      requited: true,
      minLength: 3,
    },
    rootDirId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    strict: "throw",
    collection: "users",
  },
);

// Password compare
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
