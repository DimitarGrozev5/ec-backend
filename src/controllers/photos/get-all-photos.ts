import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { parseZodError } from "../../util/zod-error";
import { prisma } from "../../db";
import { Photo, Prisma, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import {
  PhotoGetQueryParams,
  photoGetQueryParams_Schema,
} from "../../model/photos";

export const getAllPhotos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let query: PhotoGetQueryParams;
  try {
    query = photoGetQueryParams_Schema.parse(req.query);
  } catch (error: unknown) {
    const errMsg = parseZodError(error) ?? "Invalid data";
    return next(new ServerError(422, errMsg));
  }

  // Construct query
  let searchQuery: Prisma.PhotoFindManyArgs<DefaultArgs> = {};
  if (query.orderBy) {
    searchQuery = {
      ...searchQuery,
      orderBy: { [query.orderBy]: query.order || "asc" },
    };
  }
  if (query.limit) {
    searchQuery = { ...searchQuery, take: query.limit };

    if (query.page) {
      searchQuery = { ...searchQuery, skip: (query.page - 1) * query.limit };
    }
  }

  // Get photos
  let photos: (Photo & { User: Pick<User, "id" | "email"> })[];
  try {
    photos = await prisma.photo.findMany({
      ...searchQuery,
      include: { User: { select: { id: true, email: true } } },
    });
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetchin users!"));
  }

  const json = superjson.stringify({ photos });

  res.json({ json });
};
