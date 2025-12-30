import express from "express";

import validateIdMiddleware from "../middleware/validateIdMiddleware.js";
import {
  deleteFile,
  getFile,
  renameFile,
  uploadFile,
} from "../controllers/fileController.js";

const router = express.Router();

router.param("id", validateIdMiddleware);

router.route("/:id").get(getFile).patch(renameFile).delete(deleteFile);

router.route("/{:id}").post(uploadFile);

export default router;
