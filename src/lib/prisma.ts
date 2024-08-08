import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";

const globalForPrism = global as unknown as { prism: PrismaClient };

export const prisma =
  globalForPrism.prism ||
  new PrismaClient().$extends({
    result: {
      user: {
        joinedFormatted: {
          needs: { joinedAt: true },
          compute(user) {
            return DateTime.fromJSDate(user.joinedAt).toFormat("MMMM yyyy");
          },
        },
      },
    },
  });
