import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name field is required"],
      minLength: [3, "name should be minimum of length 3"],
      trim: true,
      alias: "nam",
    },
    age: {
      type: Number,
      required: [true, "age field is required"],
      min: 12,
      max: 100,
      validate: {
        validator: function () {
          console.log("Running Custom Validator");
          return this.age % 2 === 0;
        },
        message: "age can only be an even number",
      },
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
    password: String,
    hobbies: [String],
    parentId: {
      type: Schema.Types.ObjectId,
      required: function () {
        return this.age < 16;
      },
      default: null,
      ref: "User",
    },
  },
  {
    strict: "throw",
    timestamps: true,
    versionKey: "__v", // false
    collection: "users",
  }
);

/* Query Middleware */
// ["find","findOne"] or /^find/
userSchema.pre("find", function () {
  console.log("pre find hook");
  this.find({ age: { $gte: 30 } })
    .sort({ age: 1 })
    .select("name age hobbies");
});

userSchema.post("find", function (document) {
  console.log("post find hook");
  console.log(document);
});

const User = mongoose.model("User", userSchema);

export default User;
