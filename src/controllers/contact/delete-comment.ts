import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { Comment, User } from "@prisma/client";
import { decodeAuthToken } from "../../util/decode-auth-token";
import { isAdmin } from "../../middlewares/is-admin";
import { deleteFile } from "../../util/delete-file";

export const deleteContactMsgController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let messageId = req.params.messageId;
  if (messageId === undefined || Number.isNaN(+messageId)) {
    return next(new ServerError(422, "Error finding comment"));
  }

  // Delete comment
  try {
    await prisma.contactMessage.delete({
      where: {
        id: +messageId,
      },
    });
  } catch (error: unknown) {
    return next(new ServerError(500, "Error deleting message!"));
  }

  res.json({ message: "Message deleted successfully" });
};
