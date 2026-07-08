# ORTIZ Car Rental — Next.js + Supabase

Website rental mobil ORTIZ Bali. Next.js 14 (App Router) + Prisma + Supabase PostgreSQL.

## Stack
- **Framework:** Next.js 14, TypeScript, Tailwind CSS
- **Database:** Supabase PostgreSQL via Prisma ORM
- **Auth:** JWT (jose) + httpOnly cookies
- **Deploy:** Vercel (native)

## Features
- Landing page dengan data mobil dinamis dari database
- Admin panel (`/admin`) — CRUD: Categories, Cars, Articles, Bookings
- Dashboard statistik (total mobil, booking pending, revenue, artikel)
- Booking via WhatsApp redirect
- API seed endpoint (`POST /api/seed?secret=ortiz-seed-2024`)

## Deploy to Vercel

1. Push repo ke GitHub
2. Import di [vercel.com/new](https://vercel.com/new)
3. Set environment variables:
   ```
   DATABASE_URL=postgresql://postgres.ykqbxvgiuwwdqczazovp:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_DATABASE_URL=postgresql://postgres:PASSWORD@db.ykqbxvgiuwwdqczazovp.supabase.co:5432/postgres
   JWT_SECRET=your-secret-key
   SEED_SECRET=ortiz-seed-2024
   ```
4. Deploy
5. Buka `https://YOUR-APP.vercel.app/api/seed?secret=ortiz-seed-2024` (POST request) untuk isi data awal

## Admin Login
```
Email:    admin@ortiz.com
Password: password
```
