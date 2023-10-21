import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ServerError } from "../model/server-error";
import { decodeAuthToken } from "../util/decode-auth-token";

export const isAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await decodeAuthToken(req);

    next();
  } catch (err) {
    const error = new ServerError(401, "Authentication failed!");
    return next(error);
  }
};
