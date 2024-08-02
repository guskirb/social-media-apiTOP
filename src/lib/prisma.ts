import { PrismaClient } from "@prisma/client";

const globalForPrism = global as unknown as { prism: PrismaClient };

export const prisma = globalForPrism.prism || new PrismaClient();
