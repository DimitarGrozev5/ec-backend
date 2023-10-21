import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ServerError } from "../model/server-error";
import { JWTPayload } from "../model/jwt";
import { prisma } from "../db";
import { decodeAuthToken } from "../util/decode-auth-token";

export const isAdmin = async (req: Request) => {
  try {
    const decodedPayload = await decodeAuthToken(req);

    if (decodedPayload === null) {
      throw new Error();
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decodedPayload.userId },
    });
    if (!user || !user.isAdmin) {
      throw new Error();
    }

    return true;
  } catch (err) {
    return false;
  }
};

export const isAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (await isAdmin(req)) {
    return next();
  }
  const error = new ServerError(
    401,
    "You must be an Admin to perform this action!"
  );
  return next(error);
};
