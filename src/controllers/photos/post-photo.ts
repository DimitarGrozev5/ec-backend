import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { User } from "@prisma/client";
import { prisma } from "../../db";
import { decodeAuthToken } from "../../util/decode-auth-token";
import { deleteFile } from "../../util/delete-file";

export const uploadPhotoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If file upload has failed
  if (!req.file) {
    return next(new ServerError(400, "No file uploaded"));
  }

  // Get user
  let user: User | null;
  try {
    const token = await decodeAuthToken(req);

    if (!token) {
      throw new Error();
    }

    user = await prisma.user.findUnique({ where: { id: token?.userId } });
    if (!user) {
      throw new Error();
    }
  } catch (error: unknown) {
    deleteFile(req.file.filename);
    return next(new ServerError(500, "Error uploading file"));
  }

  // Check if user can accept new files
  if (user.photosCount >= 10) {
    deleteFile(req.file.filename);
    return next(
      new ServerError(500, "You have exeded the maximum number of photos")
    );
  }

  // Add photo name to user
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        photosCount: { increment: 1 },
        photos: { create: { createdOn: new Date(), url: req.file.filename } },
      },
    });
  } catch (error) {
    deleteFile(req.file.filename);
    return next(new ServerError(500, "Error uploading file"));
  }

  res.json({
    message: "File uploaded successfully",
  });
};
