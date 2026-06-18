# Store Ratings Platform

Full-stack web application for submitting and managing store ratings with role-based access control.

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** PostgreSQL

## Project Structure

```
Rs/
├── backend/
│   ├── ARCHITECTURE.md     # Modular monolith design docs
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── shared/         # Errors, middleware, utils, shared DTOs
│   │   ├── modules/        # Domain modules (auth, admin, stores, etc.)
│   │   ├── routes/         # Route registry
│   │   └── db/             # Schema, init, seed scripts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Shared UI components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Role-based pages
│   │   ├── services/       # API client
│   │   └── utils/          # Client-side validation
│   └── package.json
└── README.md
```

### Backend layers (per module)

`routes → controller → service → repository → DTO`

See [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md) for full details.

## Features

### System Administrator
- Dashboard with total users, stores, and ratings
- Add users (Admin, Normal User, Store Owner)
- Add stores and assign store owners
- View/filter/sort users and stores
- View user details (including store owner ratings)

### Normal User
- Self-registration and login
- Update password
- Browse/search stores by name and address
- Submit and modify ratings (1–5)

### Store Owner
- Login and update password
- Dashboard with average store rating
- View users who rated their store (sortable)

## Validation Rules

| Field    | Rule |
|----------|------|
| Name     | 20–60 characters |
| Address  | Max 400 characters |
| Password | 8–16 characters, at least 1 uppercase letter and 1 special character |
| Email    | Standard email format |
| Rating   | 1–5 |

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Setup

### 1. Create PostgreSQL database

```sql
CREATE DATABASE store_ratings;
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Update DATABASE_URL and JWT_SECRET in .env
npm install
npm run db:init
npm run db:seed
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Default Seed Accounts

| Role         | Email                     | Password   |
|--------------|---------------------------|------------|
| Admin        | admin@storeplatform.com   | Admin@123  |
| Store Owner  | owner@freshmart.com       | Admin@123  |

Normal users register via the signup page.

## API Overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| PUT | `/api/auth/password` | Authenticated |
| GET | `/api/admin/dashboard` | Admin |
| GET/POST | `/api/admin/users` | Admin |
| GET/POST | `/api/admin/stores` | Admin |
| GET | `/api/stores` | Normal User |
| POST | `/api/stores/:storeId/ratings` | Normal User |
| GET | `/api/owner/dashboard` | Store Owner |

## Database Schema

- **users** — id, name, email, password_hash, address, role (`ADMIN`, `USER`, `STORE_OWNER`)
- **stores** — id, name, email, address, owner_id
- **ratings** — id, user_id, store_id, rating (1–5), unique per user/store pair
