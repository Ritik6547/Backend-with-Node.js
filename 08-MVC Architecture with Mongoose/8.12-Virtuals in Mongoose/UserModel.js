import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
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
    virtuals: {
      isAdult: {
        get() {
          return this.age >= 18;
        },
      },
      hobbiesString: {
        get() {
          let str = "";
          this.hobbies.forEach((hobby, i) => {
            str += hobby;
            if (i != this.hobbies.length - 1) {
              str += ", ";
            }
          });
          return str;
        },
        set(value) {
          const newHobbies = value.split(", ");
          this.hobbies = [...this.hobbies, ...newHobbies];
        },
      },
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    methods: {
      getSummary() {
        return `${this.name} is ${this.age} years old.`;
      },
    },
  }
);

UserSchema.virtual("emailDomain").get(function () {
  return this.email.split("@")[1];
});

const User = mongoose.model("User", UserSchema);

export default User;
