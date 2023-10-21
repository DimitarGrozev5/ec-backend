import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { ContactMessage } from "@prisma/client";

export const getAllContactMsgs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get messages
  let messages: ContactMessage[];
  try {
    messages = await prisma.contactMessage.findMany();
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetchin users!"));
  }

  const json = superjson.stringify({ messages });

  res.json({ json });
};
