import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { User } from "@prisma/client";

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let userId = req.params.userId;
  if (userId === undefined || Number.isNaN(+userId)) {
    return next(new ServerError(422, "Error fetching user"));
  }

  // Delete user
  try {
    await prisma.user.delete({ where: { id: +userId } });
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetching user!"));
  }

  res.json({ message: "User deleted successfully" });
};
