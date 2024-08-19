import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

import { prisma } from "../lib/prisma";
import { issueJWT } from "../utils/issue-jwt";

export const get_users = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    where: {
      ...(req.query.search
        ? {
            OR: [
              {
                username: {
                  contains: req.query.search as string,
                },
              },
              {
                name: {
                  contains: req.query.search as string,
                },
              },
            ],
          }
        : {}),
    },
    include: {
      friends: true,
      requests: true,
      outgoingRequests: true,
    },
  });

  res.status(200).json({
    success: true,
    users,
  });
});

export const get_user = asyncHandler(async (req: Request, res: Response) => {
  const page: number = parseInt(req.query.page as string);
  const limit: number = parseInt(req.query.limit as string);
  const startIndex = (page - 1) * limit;

  const user = await prisma.user.findFirst({
    where: {
      username: req.params.username,
    },
    include: {
      _count: {
        select: {
          posts: true,
          friends: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    user,
  });
});

export const get_me = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.user!.id,
    },
    include: {
      friends: true,
      requests: true,
      outgoingRequests: true,
    },
  });

  res.status(200).json({
    success: true,
    user,
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
  }),
];

export const log_in = [
  body("username", "Username not found")
    .trim()
    .custom(async (value) => {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: value }, { username: value }],
        },
      });
      if (!user) {
        throw new Error();
      }
    })
    .escape(),
  body("password", "Password incorrect")
    .isLength({ min: 5 })
    .withMessage("Password must contain at least 5 characters")
    .custom(async (value, { req }) => {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: req.body.username }, { username: req.body.username }],
        },
      });
      if (!user) {
        throw new Error();
      } else {
        const match = await bcrypt.compare(value, user.password);
        if (!match) {
          throw new Error();
        }
      }
    })
    .escape(),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: req.body.username }, { username: req.body.username }],
      },
    });
    const jwt = issueJWT(user);

    res.status(200).json({
      success: true,
      user,
      token: jwt.token,
      expires: jwt.expires,
    });
  }),
];

export const update_user = [
  body("name").isLength({ max: 30 }).trim().escape(),
  body("bio").isLength({ max: 200 }).trim().escape(),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const newUser = {
      name: req.body.name,
      bio: req.body.bio,
    };

    for (const file in files) {
      let result = await cloudinary.uploader.upload(
        files[file][0].path,
        function (err, result) {
          if (err) {
            res.status(500).json({
              success: false,
              error: "Failed to upload",
            });
            return;
          }
          return result;
        }
      );
      newUser[file as keyof typeof newUser] = result.secure_url;
    }

    const user = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: newUser,
    });

    res.status(200).json({
      success: true,
      user,
    });
  }),
];
