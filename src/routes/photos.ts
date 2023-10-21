import express from "express";
import { getAllPhotos } from "../controllers/photos/get-all-photos";
import { isAuthMiddleware } from "../middlewares/is-auth";
import { uploadPhotoController } from "../controllers/photos/post-photo";
import { fileUploadMiddleware } from "../middlewares/file-upload";
import { getPhotoController } from "../controllers/photos/get-photo";
import { getPhotoMessagesController } from "../controllers/photos/get-photo-comments";
import { deletePhotoController } from "../controllers/photos/delete-photo";
import { getPhotoFileController } from "../controllers/photos/get-photo-file";
import { getPhotosCountController } from "../controllers/photos/get-photos-count";

const router = express.Router();

// Get all photos
router.get("/", getAllPhotos);

// Get photo count
router.get("/count", getPhotosCountController);

// Post photo
router.post(
  "/",
  isAuthMiddleware,
  fileUploadMiddleware("photo-file"),
  uploadPhotoController
);

// Get photo file
router.get("/:photoUrl/file", isAuthMiddleware, getPhotoFileController);

// Get photo
router.get("/:photoId", getPhotoController);

// Get photo comments
router.get("/:photoId/comments", getPhotoMessagesController);

// Delete photo
router.delete("/:photoId", isAuthMiddleware, deletePhotoController);

export default router;
