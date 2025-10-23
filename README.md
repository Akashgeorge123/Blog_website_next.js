# Multi-User Blogging Platform

A full-stack blogging platform built with Next.js (App Router), tRPC, Drizzle ORM, PostgreSQL, Tailwind CSS.

## Environment
Copy `env.example` to `.env.local` and set:
```
DATABASE_URL="postgres://USER:PASSWORD@HOST:5432/DB_NAME"
```

## Install & Database
```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed # optional
npm run dev
```
Open http://localhost:3000

## Features (Priority 1)
- Posts CRUD (draft/published), markdown content
- Categories CRUD, assign to posts
- Blog listing, post view, category filtering (API)
- Dashboard for managing posts/categories
- Basic responsive navigation

## tRPC Routers
- posts: list, getBySlug, create, update, delete
- categories: list, create, update, delete

## Deployment (Vercel)
- Add `DATABASE_URL` env var in Vercel (Project Settings → Environment Variables)
- Push to GitHub, import on Vercel, deploy

## Notes
- No auth; focus on core features
- Use Neon/Supabase for quick Postgres
