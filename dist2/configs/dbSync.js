import { PrismaClient, Prisma } from "@prisma/client";

const dbSync = new PrismaClient();

export { dbSync, Prisma };