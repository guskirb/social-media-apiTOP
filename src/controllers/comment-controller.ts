import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";

import { prisma } from "../lib/prisma";

export const create_comment = [
  body("comment").optional().isLength({ max: 200 }).escape(),

  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.comment || req.file) {
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
        const comment = await prisma.comment.create({
          data: {
            comment: req.body.comment ? req.body.comment : null,
            commentImg: response.secure_url,
            authorId: req.user!.id,
            postId: req.params.id,
          },
        });
        res.status(201).json({
          success: true,
          comment,
        });
      } else {
        const comment = await prisma.comment.create({
          data: {
            comment: req.body.comment,
            authorId: req.user!.id,
            postId: req.params.id,
          },
        });
        res.status(201).json({
          success: true,
          comment,
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
