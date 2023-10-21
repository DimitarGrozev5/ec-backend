import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { User } from "@prisma/client";

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let userId = req.params.userId;
  if (userId === undefined || Number.isNaN(+userId)) {
    return next(new ServerError(422, "Error fetching user"));
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

  const json = superjson.stringify({ user });

  res.json({ json });
};
