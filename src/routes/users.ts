import express from "express";
import { usersRegisterController } from "../controllers/users/register";
import { usersLoginController } from "../controllers/users/login";
import { getUsersController } from "../controllers/users/getUsers";
import { getUserController } from "../controllers/users/getUser";
import { deleteUserController } from "../controllers/users/deleteUser";
import { updateUserController } from "../controllers/users/updateUser";
import { isAuthMiddleware } from "../middlewares/is-auth";
import { isAdminMiddleware } from "../middlewares/is-admin";
import { getUsersCountController } from "../controllers/users/get-users-count";

const router = express.Router();

// Get all users
router.get("/", getUsersController);

// Get users count
router.get("/count", getUsersCountController);

// Register
router.post("/register", usersRegisterController);

// Login
router.post("/login", usersLoginController);

// Logout
router.post("/logout", isAuthMiddleware, (req, res) => {
  // TODO: Add blacklisted tokens
  res.json({ message: "logout" });
});

// Get user
router.get("/:userId", isAuthMiddleware, getUserController);

// Update user
router.put("/:userId", isAuthMiddleware, updateUserController);

// Delete user
router.delete("/:userId", isAdminMiddleware, deleteUserController);

export default router;
