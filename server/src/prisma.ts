import { PrismaClient } from "@prisma/client";

// Ensure a single PrismaClient across hot-reloads (dev) and multiple imports
type GlobalWithPrisma = typeof globalThis & { prisma?: PrismaClient };
const g = globalThis as GlobalWithPrisma;

const prismaClient =
	g.prisma ||
	new PrismaClient({
		log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "info", "warn", "error"],
	});

if (process.env.NODE_ENV !== "production") {
	g.prisma = prismaClient;
}

// Optional: warm up connection on startup in index.ts
export const prisma = prismaClient;

export default prisma;
