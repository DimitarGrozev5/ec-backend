import { Request } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload, JWTPayloadType } from "../model/jwt";

export const decodeAuthToken = async (
  req: Request
): Promise<JWTPayloadType | null> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw "";
    }

    // Verify JWT
    const tokenPayload = jwt.verify(token, process.env.jwtKey!);

    const decodedPayload = JWTPayload.parse(tokenPayload);

    return decodedPayload;
  } catch (err) {
    return null;
  }
};
