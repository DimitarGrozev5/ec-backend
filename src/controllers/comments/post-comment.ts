import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { CommentPostData, commentPost_Schema } from "../../model/comments";
import { parseZodError } from "../../util/zod-error";

export const postCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let body: CommentPostData;
  try {
    body = commentPost_Schema.parse(req.body);
  } catch (error: unknown) {
    const errMsg = parseZodError(error) ?? "Invalid data";
    return next(new ServerError(422, errMsg));
  }

  try {
    await prisma.comment.create({
      data: {
        createdOn: new Date(),
        text: body.text,
        madeBy: {
          connect: {
            id: body.byUser,
          },
        },
        Photo: {
          connect: {
            id: body.forPhoto,
          },
        },
      },
    });
  } catch (error) {
    return next(new ServerError(500, "Failed to post comment"));
  }

  res.json({
    message: "Comment posted successfully",
  });
};
