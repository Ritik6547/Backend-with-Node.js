import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name field is required"],
      minLength: [3, "name should be minimum of length 3"],
      trim: true,
      alias: "nam",
      index: true,
    },

    email: {
      type: String,
      required: [true, "email field is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email",
      ],
      lowercase: true,
      trim: true,
    },
  },
  {
    strict: "throw",
    timestamps: true,
    versionKey: "__v", // false
    collection: "users",
  }
);

const User = mongoose.model("User", userSchema);

await User.init();

export default User;
