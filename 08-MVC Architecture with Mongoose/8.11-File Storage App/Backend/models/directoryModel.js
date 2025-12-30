import mongoose, { Schema } from "mongoose";

const directorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    strict: "throw",
  }
);

const Directory = mongoose.model("Directory", directorySchema);

export default Directory;
