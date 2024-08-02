import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const get_users = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  res.status(200).json({
    success: true,
    users,
  });
});
