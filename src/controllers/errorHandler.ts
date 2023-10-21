import { Request, Response, NextFunction } from "express";
import { ServerError } from "../model/server-error";

export const errorHandler = (
  error: ServerError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next();
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
};
