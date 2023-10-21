import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../model/server-error";
import { prisma } from "../../db";
import { parseZodError } from "../../util/zod-error";
import {
  ContactMsgPostData,
  contactMsgPost_Schema,
} from "../../model/contact-msg";
import { sendMail } from "../../util/send-mail";

export const postContactMsgController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate input
  let body: ContactMsgPostData;
  try {
    body = contactMsgPost_Schema.parse(req.body);
  } catch (error: unknown) {
    const errMsg = parseZodError(error) ?? "Invalid data";
    return next(new ServerError(422, errMsg));
  }

  const now = new Date();

  try {
    await prisma.contactMessage.create({
      data: {
        createdOn: now,
        email: body.email,
        message: body.message,
        name: body.name,
      },
    });
  } catch (error) {
    return next(new ServerError(500, "Failed to post message"));
  }

  res.json({
    message: "Message posted successfully",
  });

  await sendMail({
    to: "XXXXXXXXXXXXXXXXXX",
    subject: "New contact msg",
    text: `Date: ${now.toISOString()}, From: ${body.email}, Name: ${
      body.name
    }, Message: ${body.message}`,
  });
};
