import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";

import { prisma } from "../lib/prisma";

export const get_post = asyncHandler(async (req: Request, res: Response) => {
  const post = await prisma.post.findFirst({
    where: {
      id: req.params.id,
    },
    include: {
      likedBy: true,
      comments: true,
    },
  });

  res.status(200).json({
    success: true,
    post,
  });
});

export const get_posts = asyncHandler(async (req: Request, res: Response) => {
  const friends = await prisma.user.findFirst({
    where: { id: req.user!.id },
    select: { friends: { select: { id: true } } },
  });

  const posts = await prisma.post.findMany({
    where: {
      author: {
        id: { in: [...friends!.friends.map((user) => user.id), req.user!.id] },
      },
    },
    include: {
      likedBy: true,
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    posts,
  });
});

export const create_post = [
  body("post").optional().isLength({ max: 200 }).escape(),

  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.post || req.file) {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      if (req.file) {
        let response = await cloudinary.uploader.upload(
          req.file?.path!,
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
        const post = await prisma.post.create({
          data: {
            post: req.body.post ? req.body.post : null,
            postImg: response.secure_url,
            authorId: req.user!.id,
          },
        });
        res.status(201).json({
          success: true,
          post,
        });
      } else {
        const post = await prisma.post.create({
          data: {
            post: req.body.post,
            authorId: req.user!.id,
          },
        });
        res.status(201).json({
          success: true,
          post,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        msg: "No post data submitted",
      });
    }
  }),
];

export const like_post = asyncHandler(async (req: Request, res: Response) => {
  const post = await prisma.post.update({
    where: {
      id: req.params.id,
    },
    data: {
      likedBy: { connect: [{ id: req.user!.id }] },
    },
  });

  res.status(200).json({
    success: true,
    post,
  });
});

export const unlike_post = asyncHandler(async (req: Request, res: Response) => {
  const post = await prisma.post.update({
    where: {
      id: req.params.id,
    },
    data: {
      likedBy: { disconnect: [{ id: req.user!.id }] },
    },
  });

  res.status(200).json({
    success: true,
    post,
  });
});

export const delete_post = asyncHandler(async (req: Request, res: Response) => {
  const post = await prisma.post.findFirst({
    where: { id: req.params.id },
  });

  if (post?.authorId === req.user!.id) {
    await prisma.post.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      msg: "Post deleted",
    });
  } else {
    res.status(401).json({
      success: false,
      msg: "Not authorised to delete this post",
    });
  }
});
