import express from "express";
import { isAuthMiddleware } from "../middlewares/is-auth";
import { isAdminMiddleware } from "../middlewares/is-admin";
import { deleteCommentController } from "../controllers/comments/delete-comment";
import { postCommentController } from "../controllers/comments/post-comment";

const router = express.Router();

// Post comment
router.post("/", isAuthMiddleware, postCommentController);

// Delete comment
router.delete("/:commentId", isAdminMiddleware, deleteCommentController);

export default router;
