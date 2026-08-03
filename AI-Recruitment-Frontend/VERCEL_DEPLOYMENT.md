# Deploy the React frontend to Vercel

## Recommended setup

This folder is the Vite/React frontend. The FastAPI backend must be deployed separately and exposed through a public HTTPS URL.

## Vercel dashboard settings

- Root Directory: `frontend2`
- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

## Environment variable

Create this variable in Vercel Project Settings > Environment Variables:

```text
VITE_API_URL=https://your-backend-domain.example.com
```

Apply it to Production, Preview, and Development, then redeploy.

## SPA routing

`vercel.json` is included so refreshing routes such as `/candidates` or `/jobs` loads `index.html` instead of returning 404.

## Local development

Create `.env.local` inside `frontend2`:

```text
VITE_API_URL=http://127.0.0.1:8000
```

Then run:

```bash
npm install
npm run dev
```
