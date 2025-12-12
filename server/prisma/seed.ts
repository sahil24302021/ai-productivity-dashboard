import { prisma } from "../src/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "test@example.com";
  const password = "password";
  const hashed = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Seed user already exists:", existing.email);
    return;
  }

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });
  console.log("Seed user created:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });