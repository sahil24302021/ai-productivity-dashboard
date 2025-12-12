Commands

1) Build and start services:
docker-compose up -d --build

2) Apply Prisma migrations (inside app container or locally):
npx prisma migrate deploy

For local dev:
npx prisma migrate dev

3) Generate Prisma Client:
npx prisma generate
