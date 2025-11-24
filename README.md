# TinyLink - Next.js + MySQL (XAMPP)

This is a simple URL shortener (TinyLink) built with **Next.js (App Router)** and **MySQL**.
It matches the required routes and APIs:

- `/` — Dashboard (list, add, delete links)
- `/code/:code` — Stats page for a link
- `/:code` — Redirect to original URL
- `/healthz` — Health check
- API:
  - `POST /api/links` — Create link (409 if code exists)
  - `GET /api/links` — List all links
  - `GET /api/links/:code` — Stats for one code
  - `DELETE /api/links/:code` — Delete a link

## 1. Prerequisites

- Node.js (LTS)
- VS Code
- XAMPP (MySQL + phpMyAdmin)

## 2. Database Setup (XAMPP)

1. Start **Apache** and **MySQL** from XAMPP.
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Create database and table:
   - Click **Import**
   - Choose `sql/schema.sql`
   - Run

## 3. Configure Environment

Copy `.env.example` to `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Adjust values if needed (for example, password).

## 4. Install & Run

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## 5. Deploying to Vercel (with hosted MySQL)

Local XAMPP only works on your machine.  
For Vercel deployment you need an online MySQL (for example: Railway, PlanetScale, Aiven, etc.).

1. Create a hosted MySQL instance and get:
   - host
   - username
   - password
   - database name
2. Set those values as environment variables on Vercel:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
3. Push this project to GitHub.
4. In Vercel, **Import Project from GitHub** and deploy.

