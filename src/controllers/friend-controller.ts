import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { prisma } from "../lib/prisma";

export const remove_friend = asyncHandler(
  async (req: Request, res: Response) => {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: req.params.id },
        data: { friends: { disconnect: [{ id: req.user!.id }] } },
      }),
      prisma.user.update({
        where: { id: req.user!.id },
        data: { friends: { disconnect: [{ id: req.params.id }] } },
      }),
    ]);

    res.status(200).json({
      success: true,
      id: req.params.id,
      msg: "Removed friend",
    });
  }
);
