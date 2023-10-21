import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { Photo, User } from "@prisma/client";
import { decodeAuthToken } from "../../util/decode-auth-token";
import { isAdmin } from "../../middlewares/is-admin";
import { deleteFile } from "../../util/delete-file";

export const deletePhotoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let photoId = req.params.photoId;
  if (photoId === undefined || Number.isNaN(+photoId)) {
    return next(new ServerError(422, "Error finding photo"));
  }

  // Get photo
  let photo:
    | ({
        User: User;
      } & Omit<Photo, "User">)
    | null;
  try {
    photo = await prisma.photo.findUnique({
      where: { id: +photoId },
      include: { User: true },
    });
    if (photo === null) {
      throw new Error();
    }
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetching photo!"));
  }

  // Check if user is owner or admin
  try {
    const token = await decodeAuthToken(req);
    if (token?.userId !== photo.User.id) {
      const userIsAdmin = await isAdmin(req);

      if (!userIsAdmin) {
        throw new Error();
      }
    }
  } catch (error: unknown) {
    return next(
      new ServerError(500, "You are not authorized to delete this photo!")
    );
  }

  // Delete photo and reduce user photo count
  try {
    await prisma.$transaction(async (tr) => {
      if (photo === null) {
        throw new Error();
      }
      await tr.user.update({
        where: { id: photo?.User.id },
        data: { photosCount: { decrement: 1 } },
      });

      await tr.photo.delete({ where: { id: +photoId } });

      await deleteFile(photo?.url);
    });
  } catch (error: unknown) {
    return next(new ServerError(500, "Error deleting photo!"));
  }

  res.json({ message: "Photo deleted successfully" });
};
