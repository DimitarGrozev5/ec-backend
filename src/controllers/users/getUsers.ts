import * as superjson from "superjson";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { parseZodError } from "../../util/zod-error";
import { prisma } from "../../db";
import { Prisma, User } from "@prisma/client";
import {
  UserGetQueryParams,
  userGetQueryParams_Schema,
} from "../../model/users-route";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let query: UserGetQueryParams;
  try {
    query = userGetQueryParams_Schema.parse(req.query);
  } catch (error: unknown) {
    const errMsg = parseZodError(error) ?? "Invalid data";
    return next(new ServerError(422, errMsg));
  }

  // Construct query
  let searchQuery: Prisma.UserFindManyArgs<DefaultArgs> = {};
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

  // Get users
  let users: Omit<User, "password">[];
  try {
    users = await prisma.user.findMany({
      ...searchQuery,
      select: {
        id: true,
        isAdmin: true,
        email: true,
        createdOn: true,
        photosCount: true,
      },
    });
  } catch (error: unknown) {
    return next(new ServerError(500, "Error fetchin users!"));
  }

  const json = superjson.stringify({ users });

  res.json({ json });
};
