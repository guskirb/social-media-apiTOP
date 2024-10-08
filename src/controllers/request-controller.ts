import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { prisma } from "../lib/prisma";

export const get_requests = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await prisma.user.findFirst({
      where: {
        id: req.user!.id,
      },
      include: {
        requests: {
          include: {
            from: true,
          },
        },
        outgoingRequests: {
          include: {
            to: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      requests: user?.requests,
      outgoingRequests: user?.outgoingRequests,
    });
  }
);

export const send_request = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.params.id !== req.user!.id) {
      const existingRequest = await prisma.friendRequest.findFirst({
        where: {
          toUserId: req.params.id,
          fromUserId: req.user!.id,
        },
      });

      if (!existingRequest) {
        const request = await prisma.friendRequest.create({
          data: {
            toUserId: req.params.id,
            fromUserId: req.user!.id,
          },
        });

        res.status(201).json({
          success: true,
          request,
        });
      } else {
        res.status(409).json({
          success: false,
          request: existingRequest,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        msg: "Can't send a request to yourself",
      });
    }
  }
);

export const accept_request = asyncHandler(
  async (req: Request, res: Response) => {
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        toUserId: req.user!.id,
        fromUserId: req.params.id,
      },
    });

    if (existingRequest) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: req.params.id },
          data: { friends: { connect: [{ id: req.user!.id }] } },
        }),
        prisma.user.update({
          where: { id: req.user!.id },
          data: { friends: { connect: [{ id: req.params.id }] } },
        }),
        prisma.friendRequest.delete({
          where: {
            id: existingRequest.id,
          },
        }),
      ]);

      res.status(200).json({
        success: true,
        msg: "Request accepted",
        request: existingRequest,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Request doesn't exist",
      });
    }
  }
);

export const decline_request = asyncHandler(
  async (req: Request, res: Response) => {
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        toUserId: req.user!.id,
        fromUserId: req.params.id,
      },
    });

    if (existingRequest) {
      await prisma.friendRequest.delete({
        where: {
          id: existingRequest.id,
        },
      });

      res.status(200).json({
        success: true,
        msg: "Request declined",
        request: existingRequest,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Request doesn't exist",
      });
    }
  }
);

export const cancel_request = asyncHandler(
  async (req: Request, res: Response) => {
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        fromUserId: req.user!.id,
        toUserId: req.params.id,
      },
    });

    if (existingRequest) {
      await prisma.friendRequest.delete({
        where: {
          id: existingRequest.id,
        },
      });

      res.status(200).json({
        success: true,
        msg: "Request cancelled",
        request: existingRequest,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Request doesn't exist",
      });
    }
  }
);
