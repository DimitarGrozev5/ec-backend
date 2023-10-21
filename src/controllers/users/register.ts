import { NextFunction, Request, Response } from "express";
import { UserRegisterData, userRegister_Schema } from "../../model/users-route";
import { ServerError } from "../../model/server-error";
import { parseZodError } from "../../util/zod-error";
import { prisma } from "../../db";
import { sanitizeEmail } from "../../util/data-sanitization";
import bcrypt from "bcryptjs";

export const usersRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let body: UserRegisterData;
  try {
    body = userRegister_Schema.parse(req.body);
  } catch (error: unknown) {
    const errMsg = parseZodError(error) ?? "Invalid data";
    return next(new ServerError(422, errMsg));
  }

  // Create new user
  const passwordHash = await bcrypt.hash(body.password, 10);
  try {
    await prisma.user.create({
      data: {
        createdOn: new Date(),
        email: sanitizeEmail(body.email),
        password: passwordHash,
      },
    });
  } catch (error: unknown) {
    return next(new ServerError(500, "Failed to create user"));
  }

  res.status(201).json({ message: "User created successfully" });
};
