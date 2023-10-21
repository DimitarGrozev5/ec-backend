import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";

export const getPhotoFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let photoUrl = req.params.photoUrl;
  if (photoUrl === undefined) {
    return next(new ServerError(422, "Error fetching photo"));
  }

  // Get photo file
  // const filePath = `${process.env.uploadDir}/${photoUrl}`;
  const filePath = path.join(process.cwd(), process.env.uploadDir!, photoUrl);
  const fileExists = fs.existsSync(filePath);

  if (!fileExists) {
    return res.status(404).send("Image not found");
  }

  // Send the image file as a response
  res.sendFile(filePath);
};
