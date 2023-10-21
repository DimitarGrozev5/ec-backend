import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { Photo } from "@prisma/client";

export const getPhotoMessagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let photoId = req.params.photoId;
  if (photoId === undefined || Number.isNaN(+photoId)) {
    return next(new ServerError(422, "Error fetching photo"));
  }

  // Get photo
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: +photoId },
      include: {
        comments: {
          orderBy: { createdOn: "desc" },
          include: { madeBy: { select: { email: true, id: true } } },
        },
      },
    });
    if (photo === null) {
      throw new Error();
    }

    const json = superjson.stringify({ comments: photo.comments });

    res.json({ json });
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetching photo!"));
  }
};
