import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { User } from "@prisma/client";

export const getUsersCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get users
  let users: User[];
  try {
    users = await prisma.user.findMany();
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetchin users!"));
  }

  const json = superjson.stringify({ count: users.length });

  res.json({ json });
};
