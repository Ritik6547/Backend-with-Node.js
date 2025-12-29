import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name field is required"],
      minLength: [3, "name should be minimum of length 3"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "age field is required"],
      min: 12,
      max: 100,
    },
    email: {
      type: String,
      required: [true, "email field is required"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email",
      ],
      lowercase: true,
      trim: true,
    },
    hobbies: [String],
    parentId: {
      type: Schema.Types.ObjectId,
      required: function () {
        return this.age < 16;
      },
      default: null,
    },
  },
  {
    strict: "throw",
    timestamps: true,
    versionKey: "__v", // false
    collection: "users",
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
