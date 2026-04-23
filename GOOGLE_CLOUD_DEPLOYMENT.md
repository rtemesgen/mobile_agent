# Google Cloud Deployment Guide

This guide explains how to deploy the Mobi Agent app on Google Cloud.

Recommended setup:

- Backend: Cloud Run
- Database: Cloud SQL for PostgreSQL
- Frontend: Cloud Run

Cloud Run is used because it can run the Spring Boot backend and the built React frontend as containers.

## 1. Requirements

You need:

- A Google Cloud account
- Billing enabled on the Google Cloud project
- Google Cloud CLI installed, or use Google Cloud Shell in the browser
- Access to the GitHub repository

Check that you are logged in:

```bash
gcloud auth login
gcloud config list
```

Set your project:

```bash
gcloud config set project YOUR_PROJECT_ID
```

Choose a region. Example:

```bash
REGION=us-central1
```

On PowerShell, use:

```powershell
$REGION="us-central1"
```

## 2. Enable Google Cloud Services

Run:

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com sqladmin.googleapis.com
```

## 3. Create PostgreSQL Database On Cloud SQL

Create a PostgreSQL instance:

```bash
gcloud sql instances create mobi-agent-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=$REGION
```

Create the database:

```bash
gcloud sql databases create mobi_agent --instance=mobi-agent-db
```

Set the postgres user password:

```bash
gcloud sql users set-password postgres \
  --instance=mobi-agent-db \
  --password=YOUR_STRONG_PASSWORD
```

Get the Cloud SQL connection name:

```bash
gcloud sql instances describe mobi-agent-db --format="value(connectionName)"
```

Save the output. It looks like:

```text
project-id:region:mobi-agent-db
```

## 4. Deploy The Backend To Cloud Run

From the project root, run:

```bash
gcloud run deploy mobi-agent-api \
  --source backend \
  --region=$REGION \
  --allow-unauthenticated \
  --add-cloudsql-instances=YOUR_CONNECTION_NAME \
  --set-env-vars="DB_URL=jdbc:postgresql://google/mobi_agent?cloudSqlInstance=YOUR_CONNECTION_NAME&socketFactory=com.google.cloud.sql.postgres.SocketFactory,DB_USERNAME=postgres,DB_PASSWORD=YOUR_STRONG_PASSWORD,JWT_SECRET=CHANGE_THIS_TO_A_LONG_SECRET,CORS_ALLOWED_ORIGIN=https://TEMP_FRONTEND_URL"
```

Important: the frontend URL is not known yet. Use a temporary value first. After deploying the frontend, update `CORS_ALLOWED_ORIGIN` with the real frontend URL.

After deployment, copy the backend service URL. It will look like:

```text
https://mobi-agent-api-xxxxx.a.run.app
```

## 5. Deploy The Frontend To Cloud Run

From the project root, run:

```bash
gcloud run deploy mobi-agent-web \
  --source frontend \
  --region=$REGION \
  --allow-unauthenticated \
  --set-build-env-vars="VITE_API_URL=https://YOUR_BACKEND_URL/api"
```

After deployment, copy the frontend URL. It will look like:

```text
https://mobi-agent-web-xxxxx.a.run.app
```

## 6. Update Backend CORS

Now update the backend so it accepts requests from the frontend:

```bash
gcloud run services update mobi-agent-api \
  --region=$REGION \
  --set-env-vars="CORS_ALLOWED_ORIGIN=https://YOUR_FRONTEND_URL"
```

If this command replaces other environment variables in your setup, update all backend variables together from the Cloud Run console instead.

## 7. Test The Live App

Open the frontend URL in your browser.

Use one of the seeded demo accounts:

```text
Admin: admin@mobi.local / admin123
Mobi Agent: agent@mobi.local / agent123
```

You can also register a new user from the login page.

## 8. Common Problems

### Backend says database connection failed

Check:

- Cloud SQL instance is running
- `DB_URL` uses the correct connection name
- `DB_PASSWORD` is correct
- Cloud Run service has the Cloud SQL instance attached

### Frontend cannot login

Check:

- `VITE_API_URL` was set to the backend URL ending with `/api`
- Backend `CORS_ALLOWED_ORIGIN` is set to the frontend URL
- Backend service is running

### Port problems

Cloud Run expects apps to listen on the port in the `PORT` variable. This project already supports that in the backend and the frontend nginx container listens on port `8080`.

## 9. Useful Google Cloud Console Pages

- Cloud Run: check deployed backend and frontend services
- Cloud SQL: check PostgreSQL database
- Cloud Build: check build logs if deployment fails
- Artifact Registry: stores built container images