import express from "express";
import { postContactMsgController } from "../controllers/contact/post-contact-msg";
import { deleteContactMsgController } from "../controllers/contact/delete-comment";
import { isAdminMiddleware } from "../middlewares/is-admin";
import { getAllContactMsgs } from "../controllers/contact/get-all-messages";

const router = express.Router();

// Get all contact messages
router.get("/", isAdminMiddleware, getAllContactMsgs);

// Post contact message
router.post("/", postContactMsgController);

// Delete contact message
router.delete("/:messageId", isAdminMiddleware, deleteContactMsgController);

export default router;
