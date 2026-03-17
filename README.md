# Nura Bahar Nigeria — Frontend

React + Vite + TailwindCSS e-commerce store.

## Local Development

```bash
npm install
npm run dev
# Runs at http://localhost:5173
```

## Connect to PocketBase Backend

Open `.env.local` and set your PocketBase URL:
```
VITE_PB_URL=http://127.0.0.1:8090        # local
VITE_PB_URL=https://your-railway-url...  # production
```

## Deploy to Vercel

### Option A — CLI
```bash
npm install -g vercel
vercel
```

### Option B — Dashboard
1. Go to https://vercel.com and sign up with GitHub
2. Click New Project → Import your GitHub repo
3. Add environment variable:
   - Key:   VITE_PB_URL
   - Value: https://your-railway-url.up.railway.app
4. Click Deploy

## Admin Dashboard

- URL:      https://your-vercel-url.vercel.app/admin
- Email:    admin@nurabahar.ng
- Password: NuraBahar2025!

## Add Your Video

Place your video file at: public/videos/nurabahar.mp4
