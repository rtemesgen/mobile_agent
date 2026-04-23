# Mobi Agent User Guide

Mobi Agent is a web application created for a Satesoft internship assignment. It helps mobile money agents organize their daily work in one place.

The app is useful for managing:

- MNO agent accounts
- Cash at hand
- Mobile money wallets
- Customer transactions
- Exchange rates
- Dashboard summary numbers
- Admin and Mobi Agent user access

## Who Can Use The App

### Admin

An Admin can sign in and manage user roles. This is useful when a new user needs to be given Mobi Agent access.

### Mobi Agent

A Mobi Agent can manage accounts, wallets, transactions, exchange rates, and view dashboard statistics.

## Demo Login Details

When the app starts with an empty database, it creates two demo users automatically.

```text
Admin
Email: admin@mobi.local
Password: admin123

Mobi Agent
Email: agent@mobi.local
Password: agent123
```

The login page also has one-click buttons for the demo Admin and demo Mobi Agent accounts.

## How To Open The App

First, start the backend service.

```powershell
$env:SPRING_PROFILES_ACTIVE="dev"
gradle :backend:bootRun
```

Then open a second terminal and start the frontend.

```powershell
cd frontend
npm install
npm run dev
```

Open this link in your browser:

```text
http://localhost:5173
```

## How To Use The App

1. Sign in using one of the demo accounts, or register a new account.
2. Use the Accounts page to add MNO accounts and record cash at hand.
3. Use the Wallets page to create and manage mobile money wallets.
4. Use the Transactions page to record deposits or withdrawals.
5. Use the Exchange Rates page to add or update currency exchange rates.
6. Use the dashboard cards to quickly see totals and summaries.
7. If signed in as Admin, use the Users page to manage user roles.

## Registration

New users can register directly from the login page. Registered users are created as Mobi Agent users by default.

## Important Notes

- The app currently uses a local development database when started with the `dev` profile.
- This means demo data is mainly for local testing and presentation.
- PostgreSQL can be used later for permanent storage.
- The external MNO provider integration is currently a placeholder for future improvement.

## Project Summary

This project was built with a React frontend and a Spring Boot backend. It demonstrates role-based access, account management, wallet management, transaction recording, exchange rate management, and a simple dashboard for mobile money agent operations.