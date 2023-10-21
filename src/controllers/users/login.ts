import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { parseZodError } from "../../util/zod-error";
import { prisma } from "../../db";
import bcrypt from "bcryptjs";
import { UserLoginData, userLogin_Schema } from "../../model/users-route";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const usersLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let body: UserLoginData;
  try {
    body = userLogin_Schema.parse(req.body);
  } catch (error: unknown) {
    const errMsg = parseZodError(error) ?? "Invalid data";
    return next(new ServerError(422, errMsg));
  }

  // Get user
  let user: User | null;
  try {
    user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (user === null) {
      throw new Error();
    }
  } catch (error: unknown) {
    return next(new ServerError(500, "Error logging in user!"));
  }

  // Check password
  const passIsValid = await bcrypt.compare(body.password, user.password);
  if (!passIsValid) {
    return next(new ServerError(401, "Invalid password!"));
  }

  // Create json token
  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.jwtKey!,
      { expiresIn: "3d" }
    );
  } catch (err) {
    const error = new ServerError(500, "Login failed!");
    return next(error);
  }

  res.json({
    userId: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
};
