# Mobi Agent Web App

This project implements the Mobi Agent feature described in `Mobi_Agent_UML_Documentation.docx`.

It is a full-stack web app with:

- Spring Boot backend API
- React + TypeScript frontend
- JWT login, registration, seeded one-click login, and role-based access
- PostgreSQL as the intended production database
- H2 in-memory database for quick local development
- MNO account management, including cash at hand
- MNO wallet management
- Transaction recording and transaction history
- Exchange rate management
- Dashboard KPI stats
- Admin user role assignment
- Stubbed MNO provider integration point for future external API work

## Project Structure

```text
backend/    Spring Boot REST API
frontend/   React + TypeScript Vite app
settings.gradle
```

## Seed Users

The backend creates these users automatically when the database is empty:

```text
Admin
Email: admin@mobi.local
Password: admin123

Mobi Agent
Email: agent@mobi.local
Password: agent123
```

Use the Admin account to assign roles. Use the Mobi Agent account to manage accounts, wallets, transactions, rates, and dashboard stats. The login screen also has one-click buttons for both seeded users.

## Quick Start With H2

This is the fastest way to run the app without installing PostgreSQL.

Start the backend:

```powershell
$env:SPRING_PROFILES_ACTIVE="dev"
gradle :backend:bootRun
```

Start the frontend in another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

The frontend calls the backend at:

```text
http://localhost:8080/api
```

## PostgreSQL Setup

The default backend profile expects PostgreSQL:

```text
Database: mobi_agent
Username: postgres
Password: postgres
```

You can override these with environment variables:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/mobi_agent"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="postgres"
$env:JWT_SECRET="replace-with-a-long-secret-value"
$env:CORS_ALLOWED_ORIGIN="http://localhost:5173"
gradle :backend:bootRun
```

The backend uses Hibernate `ddl-auto: update`, so tables are created or updated automatically during development.

## Environment Files

Safe templates are included:

```text
backend/.env.example
frontend/.env.example
```

Real `.env` files are ignored by git. The frontend can use `frontend/.env` directly:

```text
VITE_API_URL=http://localhost:8080/api
```

Spring Boot does not automatically read `backend/.env`; set those values in your terminal, IDE run configuration, deployment platform, or Docker environment.

## Main API Endpoints

```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/users
PATCH  /api/users/{id}/role

GET    /api/mno-accounts
POST   /api/mno-accounts
PUT    /api/mno-accounts/{id}
DELETE /api/mno-accounts/{id}

GET    /api/mno-wallets
POST   /api/mno-wallets
PUT    /api/mno-wallets/{id}
DELETE /api/mno-wallets/{id}

GET    /api/mno-transactions
POST   /api/mno-transactions

GET    /api/exchange-rates
POST   /api/exchange-rates
PUT    /api/exchange-rates/{id}
DELETE /api/exchange-rates/{id}

GET    /api/dashboard/mobi-agent
```

## Useful Commands

Backend compile:

```powershell
gradle :backend:compileJava
```

Backend verification:

```powershell
gradle :backend:test
```

Frontend build:

```powershell
cd frontend
npm run build
```

## Notes

- The MNO provider integration is currently a stub in the backend.
- Transaction recording updates wallet balances inside a Spring transaction.
- Transaction types currently include `DEPOSIT` and `WITHDRAWAL`.
- Use the H2 dev profile for demos and PostgreSQL for persistent local or production data.