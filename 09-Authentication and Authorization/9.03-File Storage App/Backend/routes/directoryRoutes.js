import express from "express";
import validateIdMiddleware from "../middleware/validateIdMiddleware.js";
import {
  createDirectory,
  deleteDirectory,
  getDirectory,
  renameDirectory,
} from "../controllers/directoryController.js";

const router = express.Router();

router.param("id", validateIdMiddleware);

router.route("/{:id}").get(getDirectory).post(createDirectory);

router.route("/:id").patch(renameDirectory).delete(deleteDirectory);

export default router;
