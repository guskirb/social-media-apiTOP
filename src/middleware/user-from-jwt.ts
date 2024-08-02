import "dotenv";
import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

import { prisma } from "../lib/prisma";

export const userFromJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      return next();
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jsonwebtoken.verify(
      token,
      process.env.ACCESS_TOKEN as string
    );

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.sub as string,
      },
    });

    if (!user) {
      return next();
    } else {
      req.user = user;
      return next();
    }
  }
);
