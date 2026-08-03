# Production deployment

## Architecture

- Frontend: deploy `frontend2` to Vercel.
- Backend: deploy `backend` to a persistent Python hosting service.
- Database: use managed PostgreSQL in production.
- Uploaded CVs/attachments: use persistent object storage rather than the backend's local `uploads` directory.

## Frontend

See `frontend2/VERCEL_DEPLOYMENT.md`.

## Backend production variables

At minimum configure:

```text
DATABASE_URL=<managed PostgreSQL connection string>
ALLOWED_ORIGINS=https://your-project.vercel.app
OPENAI_API_KEY=<secret>
ENABLE_SCHEDULER=true
```

After the backend is deployed, set this in Vercel:

```text
VITE_API_URL=https://your-backend-domain.example.com
```
