import { ObjectId } from "mongodb";

export default function (req, res, next, id) {
  if (!ObjectId.isValid(id) || String(new ObjectId(id)) !== id) {
    return res.status(400).json({ msg: `Invalid ID : ${id}` });
  }

  next();
}
