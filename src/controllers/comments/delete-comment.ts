import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { Comment, User } from "@prisma/client";
import { decodeAuthToken } from "../../util/decode-auth-token";
import { isAdmin } from "../../middlewares/is-admin";
import { deleteFile } from "../../util/delete-file";

export const deleteCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let commentId = req.params.commentId;
  if (commentId === undefined || Number.isNaN(+commentId)) {
    return next(new ServerError(422, "Error finding comment"));
  }

  // Delete comment
  try {
    await prisma.comment.delete({
      where: {
        id: +commentId,
      },
    });
  } catch (error: unknown) {
    return next(new ServerError(500, "Error deleting comment!"));
  }

  res.json({ message: "Comment deleted successfully" });
};
