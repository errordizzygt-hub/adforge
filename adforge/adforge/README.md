# AdForge — AI Video Ad Generator

Generate cinematic product video ads using **Claude AI** + **Runway Gen-3 Alpha Turbo**.

Upload a product photo → configure style & branding → get real AI-generated video clips.

---

## Deploy to Vercel (5 minutes, free)

### Step 1 — Create a GitHub account (if you don't have one)
Go to **github.com** and sign up for free.

### Step 2 — Upload this project to GitHub
1. Go to **github.com/new** to create a new repository
2. Name it `adforge` and click **Create repository**
3. Upload all the project files by clicking **uploading an existing file**
4. Drag the entire `adforge` folder contents in and click **Commit changes**

### Step 3 — Create a Vercel account
Go to **vercel.com** and sign up with your GitHub account (free).

### Step 4 — Deploy
1. On Vercel, click **Add New → Project**
2. Select your `adforge` GitHub repository
3. Vercel will auto-detect it as a Vite project — click **Deploy**
4. Wait ~60 seconds — Vercel gives you a live URL like `adforge-xyz.vercel.app`

### Step 5 — Add your Runway API key (IMPORTANT)
This is how your key stays secure — it never touches the browser.

1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Click **Add New**
3. Set:
   - **Name:** `RUNWAY_API_KEY`
   - **Value:** your Runway API key (from dev.runwayml.com → API Keys)
4. Click **Save**
5. Go to **Deployments** and click **Redeploy** (so the key takes effect)

That's it! Your app is live and fully working. 🎉

---

## How it works

```
User uploads product image
        ↓
Claude AI analyzes image → generates headline, tagline, voiceover script, shot list
        ↓
For each scene (10s each):
  App calls /api/create-task (Vercel serverless function)
        ↓
  Vercel function calls Runway API with your key (server-side, secure)
        ↓
  App polls /api/poll-task every 5 seconds
        ↓
  When ready → real .mp4 video URL returned
        ↓
User previews & downloads each clip
```

---

## Cost estimate

| Action | Cost |
|--------|------|
| Generate ad script (Claude) | ~$0.003 per ad |
| 10s video clip (Runway Gen-3) | ~5 Runway credits (~$0.50) |
| 30s ad (3 clips) | ~15 Runway credits (~$1.50) |

Runway credits: $10 = ~100 seconds of video. Get credits at **dev.runwayml.com**.

---

## Project structure

```
adforge/
├── api/
│   ├── create-task.js    ← Vercel serverless: creates Runway video task
│   └── poll-task.js      ← Vercel serverless: polls task status
├── src/
│   ├── main.jsx          ← React entry point
│   └── App.jsx           ← Main app (4-step ad generation flow)
├── index.html            ← HTML entry point
├── package.json          ← Dependencies
├── vite.config.js        ← Vite config
├── vercel.json           ← Vercel deployment config
└── README.md             ← This file
```

---

## Troubleshooting

**"RUNWAY_API_KEY environment variable is not set"**
→ You forgot Step 5. Add the env var in Vercel Settings and redeploy.

**Scene shows "RENDER FAILED"**
→ Check your Runway account has enough credits at dev.runwayml.com

**Blank page after deploy**
→ Make sure all files were uploaded to GitHub correctly. Check the `src/` folder exists.

**Generation times out**
→ Runway can take 2–4 minutes per clip. This is normal. The app polls for up to 6 minutes.
