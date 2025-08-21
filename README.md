## FlavorAI — Minimal Quickstart

Prereqs: Docker, Node 18+

1. Start Postgres

```bash
docker compose up -d
```

2. Backend env
   Create `server/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flavorai"
JWT_SECRET="super-secret-key"
NODE_ENV="development"
```

3. Install deps

```bash
cd server && npm install
cd ../web && npm install
```

4. Prisma push + seed

```bash
cd server
npm run prisma:push
npm run prisma:seed
```

5. Run apps

```bash
# API (http://localhost:3001)
cd server && npm run start:dev
# Web (http://localhost:3000)
cd web && npm run dev
```

Optional: set `NEXT_PUBLIC_API_URL` for the web; defaults to http://localhost:3001.

