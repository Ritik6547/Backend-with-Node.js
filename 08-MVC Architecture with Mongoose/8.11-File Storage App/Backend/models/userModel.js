import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      match: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$",
    },
    password: {
      type: String,
      requited: true,
      min: 3,
    },
    rootDirId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    strict: "throw",
  }
);

const User = mongoose.model("User", userSchema);

export default User;
