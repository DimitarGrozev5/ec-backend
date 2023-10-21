import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { Photo } from "@prisma/client";

export const getPhotoController = async (
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
  let photo: Photo | null;
  try {
    photo = await prisma.photo.findUnique({
      where: { id: +photoId },
    });
    if (photo === null) {
      throw new Error();
    }
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetching photo!"));
  }

  const json = superjson.stringify({ photo });

  res.json({ json });
};
