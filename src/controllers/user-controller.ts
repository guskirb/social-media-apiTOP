import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const get_users = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  res.status(200).json({
    success: true,
    users,
  });
});

export const create_user = [
  body("username", "Username is required")
    .trim()
    .notEmpty()
    .custom(async (value) => {
      const user = await prisma.user.findFirst({
        where: {
          username: value,
        },
      });
      if (user) {
        throw new Error("Username already in use");
      }
    })
    .escape(),
  body("email", "Email is required")
    .trim()
    .isEmail()
    .custom(async (value) => {
      const user = await prisma.user.findFirst({
        where: {
          email: value,
        },
      });
      if (user) {
        throw new Error("Email already in use");
      }
    })
    .escape(),
  body("password", "Password is required")
    .isLength({ min: 5 })
    .withMessage("Password must contain at least 5 characters")
    .escape(),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUser = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashedPass,
      },
    });
    
    res.status(201).json({
      success: true,
      user: newUser,
    });
    return;
  }),
];
