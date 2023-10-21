import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { User } from "@prisma/client";
import { UserUpdateData, userUpdate_Schema } from "../../model/users-route";
import { parseZodError } from "../../util/zod-error";
import bcrypt from "bcryptjs";
import { decodeAuthToken } from "../../util/decode-auth-token";
import { isAdmin } from "../../middlewares/is-admin";

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let userId = req.params.userId;
  if (userId === undefined || Number.isNaN(+userId)) {
    return next(new ServerError(422, "Error fetching user"));
  }

  let body: UserUpdateData;
  try {
    body = userUpdate_Schema.parse(req.body);
  } catch (error: unknown) {
    const errMsg = parseZodError(error) ?? "Invalid data";
    return next(new ServerError(422, errMsg));
  }

  // Both old and new password must be present
  if (body.oldPassword !== undefined && body.newPassword === undefined) {
    return next(new ServerError(422, "Please input new password!"));
  }
  if (body.oldPassword === undefined && body.newPassword !== undefined) {
    return next(new ServerError(422, "Please input old password!"));
  }

  // Get user
  let user: User | null;
  try {
    user = await prisma.user.findUnique({ where: { id: +userId } });
    if (user === null) {
      throw new Error();
    }
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetching user!"));
  }

  // Check if user is owner or admin
  try {
    const token = await decodeAuthToken(req);
    if (token?.userId !== user.id) {
      const userIsAdmin = await isAdmin(req);

      if (!userIsAdmin) {
        throw new Error();
      }
    }
  } catch (error: unknown) {
    return next(
      new ServerError(500, "You are not authorized to change this user!")
    );
  }

  // Check password
  let newPassHash: string | undefined = undefined;
  if (body.oldPassword !== undefined && body.newPassword !== undefined) {
    const oldPasswordIsValid = await bcrypt.compare(
      body.oldPassword,
      user.password
    );

    if (!oldPasswordIsValid) {
      return next(new ServerError(401, "Invalid password!"));
    }

    newPassHash = await bcrypt.hash(body.newPassword, 10);
  }

  // Update user
  try {
    await prisma.user.update({
      where: { id: +userId },
      data: {
        email: body.email ?? user.email,
        password: newPassHash ?? user.password,
      },
    });
    if (user === null) {
      throw new Error();
    }
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetching user!"));
  }

  res.json({ message: "User updated successfully!" });
};
