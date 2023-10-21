import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { Photo } from "@prisma/client";

export const getPhotosCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get photos
  let photos: Photo[];
  try {
    photos = await prisma.photo.findMany();
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetchin users!"));
  }

  const json = superjson.stringify({ count: photos.length });

  res.json({ json });
};
