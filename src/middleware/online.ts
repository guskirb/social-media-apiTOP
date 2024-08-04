import { Request, Response, NextFunction } from "express";

import { prisma } from "../lib/prisma";

export const last_online = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    try {
      await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          lastOnline: new Date(),
        },
      });
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
};
