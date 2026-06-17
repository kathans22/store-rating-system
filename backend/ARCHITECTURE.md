# Backend Architecture

Modular monolith with clear separation of concerns per domain module.

## Layered flow

```
HTTP Request
    ↓
Routes          → URL mapping + middleware (auth, validation)
    ↓
Controller      → HTTP adapter (status codes, req/res)
    ↓
Service         → Business logic + orchestration
    ↓
Repository      → Database access (PostgreSQL)
    ↓
DTO             → Request parsing + response shaping
```

## Folder structure

```
backend/src/
├── app.js                 # Express bootstrap
├── server.js              # Entry point
├── config/                # Infrastructure config
├── routes/index.js        # Route registry
├── shared/                # Cross-cutting concerns
│   ├── constants/
│   ├── dto/
│   ├── errors/            # AppError + global handler
│   ├── middleware/        # auth, validation, asyncHandler
│   └── utils/
├── modules/
│   ├── auth/              # Login, register, password
│   ├── admin/             # Admin dashboard & management
│   ├── users/             # User repository + DTOs
│   ├── stores/            # Store browse + admin stores
│   ├── ratings/           # Rating repository + DTOs
│   └── owner/             # Store owner dashboard
└── db/                    # Schema, migrations, seed
```

## Module responsibilities

| Module   | Routes prefix   | Layers |
|----------|-----------------|--------|
| auth     | `/api/auth`     | routes → controller → service → user.repository |
| admin    | `/api/admin`    | routes → controller → service → users/stores/ratings repos |
| stores   | `/api/stores`   | routes → controller → service → store + rating repos |
| owner    | `/api/owner`    | routes → controller → service → store + rating repos |

## DTO pattern

- **Request DTOs** — `fromRequest(body)` normalizes and validates shape before service layer
- **Response DTOs** — `fromEntity()` / `fromEntities()` map DB rows to API contracts
- Keeps controllers thin and prevents leaking internal DB column names

## Error handling

Services throw `AppError` with HTTP status codes. The global `errorHandler` converts them to JSON responses. Validation errors from `express-validator` are returned as `{ message, errors }`.

## Adding a new feature

1. Add DTOs in `modules/<domain>/dto/`
2. Add repository methods if new DB access is needed
3. Implement business logic in `<domain>.service.js`
4. Wire HTTP in `<domain>.controller.js` + `<domain>.routes.js`
5. Register route in `routes/index.js`
