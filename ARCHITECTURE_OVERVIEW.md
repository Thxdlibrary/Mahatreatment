# Discord Music Bot: Architecture & Deployment Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DISCORD SERVER                           │
│  ┌────────────────┐              ┌──────────────────┐      │
│  │  User/Admin    │ Commands     │  Voice Channel   │      │
│  │  Uses: /play   │──────────────→│  Music Streaming │      │
│  └────────────────┘              └──────────────────┘      │
└──────────────────────────────────────────────────────────────┘
                           ▲
                           │ Discord API
                           │
┌──────────────────────────────────────────────────────────────┐
│                    RAILWAY (Cloud)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     Docker Container (Node.js + FFmpeg)              │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  discord_music_bot.js                          │  │   │
│  │  │  - Listen for commands                         │  │   │
│  │  │  - Manage queue                                │  │   │
│  │  │  - Stream audio via Discord API                │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  /data/music (Storage Volume)                  │  │   │
│  │  │  - song1.mp3, song2.wav, etc.                  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Environment Variables (Secrets):                          │
│  - DISCORD_TOKEN (from Discord Dev Portal)                │
│  - ADMIN_ROLE_ID (from Discord)                           │
│  - MUSIC_FOLDER = /data/music                             │
└──────────────────────────────────────────────────────────────┘
                           ▲
                           │ Auto Sync
                           │
┌──────────────────────────────────────────────────────────────┐
│                    GITHUB                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  discord-music-bot Repository                        │   │
│  │                                                      │   │
│  │  discord_music_bot.js                               │   │
│  │  package.json                                       │   │
│  │  Procfile                                           │   │
│  │  Dockerfile                                         │   │
│  │  .gitignore                                         │   │
│  │  .env.example                                       │   │
│  │  docs/                                              │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                           ▲
                           │ git push
                           │
                    YOUR LOCAL MACHINE
```

---

## Deployment Flow

### Option 1: Local Development
```
Your PC
  ↓
npm install
  ↓
Create .env with DISCORD_TOKEN & ADMIN_ROLE_ID
  ↓
Add music files to ./music/
  ↓
npm start
  ↓
Bot runs locally (only while PC is on)
```

### Option 2: Railway Cloud (Recommended) ⭐
```
Your PC (Local)
  ↓
Code changes
  ↓
git push to GitHub
  ↓
GitHub receives code
  ↓
Railway detects new code
  ↓
Railway builds Docker image
  ↓
Deploys to container
  ↓
Bot runs 24/7 on Railway's servers
  ↓
Set Environment Variables in Railway
  ↓
Upload music files to /data/music
  ↓
Bot is live! Always online!
```

---

## File Structure Explained

```
discord-music-bot/
│
├── discord_music_bot.js          ← Main bot code
├── package.json                   ← Dependencies (discord.js, etc)
│
├── Procfile                       ← Tells Railway how to start bot
├── Dockerfile                     ← Container blueprint
├── .dockerignore                  ← What to exclude from Docker
│
├── .env.example                   ← Template for variables (COMMIT THIS)
├── .env                           ← YOUR SECRETS (DON'T COMMIT)
├── .gitignore                     ← Tells Git to ignore .env and music/
│
├── music/                         ← Your music files
│   ├── song1.mp3
│   ├── song2.wav
│   └── song3.ogg
│
├── README.md                      ← Project overview
├── SETUP_GUIDE.md                ← Full setup instructions
├── QUICK_REFERENCE.md            ← Command cheatsheet
├── ADVANCED_CONFIG.md            ← Custom configuration
├── GITHUB_RAILWAY_QUICK_SETUP.md ← This deployment guide
├── RAILWAY_DEPLOYMENT.md         ← Detailed Railway info
└── FFMPEG_INSTALL_WINDOWS.md    ← Windows FFmpeg guide
```

---

## Environment Variables

### What They Are
Variables that tell Railway where to find your secrets (token) and files (music folder).

### Where They Go

**Locally:** In `.env` file (NOT committed to GitHub)
```
DISCORD_TOKEN=xyzabc123...
ADMIN_ROLE_ID=987654321
MUSIC_FOLDER=./music
```

**On Railway:** In Railway dashboard Variables tab (Secrets vault)
```
DISCORD_TOKEN = xyzabc123...
ADMIN_ROLE_ID = 987654321
MUSIC_FOLDER = /data/music
```

### Why Separate?
- **Local:** `./music` folder in your computer
- **Railway:** `/data/music` volume on Railway's server

---

## Deployment Timeline

### Initial Setup (First Time)
```
Task                  Time    Status
─────────────────────────────────────
GitHub Repo Creation   2 min   ✅ One-time
Push Code              2 min   ✅ One-time
Railway Setup          2 min   ✅ One-time
Add Variables          2 min   ✅ One-time
Upload Music           2 min   ✅ One-time
─────────────────────────────────────
TOTAL FIRST TIME       10 min  🎉
```

### Future Updates
```
Task                  Time    Status
─────────────────────────────────────
Make code changes      varies  ✅ Your work
git commit            1 min    ✅ 1 command
git push              1 min    ✅ Auto-deploys
─────────────────────────────────────
TOTAL UPDATES         ~2 min   ⚡ Very fast!
```

---

## What Gets Stored Where?

### GitHub (Public Repo)
- ✅ Bot code (`discord_music_bot.js`)
- ✅ Config files (`Procfile`, `Dockerfile`)
- ✅ Documentation (`.md` files)
- ❌ DO NOT commit: `.env`, music files, secrets

### Railway (Cloud)
- ✅ Running bot (Docker container)
- ✅ Secrets (DISCORD_TOKEN in variables)
- ✅ Music files (`/data/music` volume)
- ✅ Logs and uptime monitoring

### Your Local PC
- ✅ Source code (for editing)
- ✅ Local `.env` (test bot locally)
- ✅ Draft music files (before uploading to Railway)

---

## The Complete Flow: Start to Finish

```
STEP 1: LOCAL SETUP
┌──────────────────────────┐
│ npm install              │
│ cp .env.example .env     │
│ Add DISCORD_TOKEN        │
│ Add ADMIN_ROLE_ID        │
│ npm start (test locally) │
└──────────────────────────┘
            ↓
STEP 2: GITHUB
┌──────────────────────────┐
│ git init                 │
│ git add .                │
│ git commit -m "Initial"  │
│ git push to GitHub       │
└──────────────────────────┘
            ↓
STEP 3: RAILWAY
┌──────────────────────────┐
│ Create Railway account   │
│ Connect GitHub           │
│ Click "Deploy"           │
│ Railway auto-deploys! 🚀 │
└──────────────────────────┘
            ↓
STEP 4: CONFIGURE
┌──────────────────────────┐
│ Add Variables in Railway │
│ - DISCORD_TOKEN          │
│ - ADMIN_ROLE_ID          │
│ - MUSIC_FOLDER=/data     │
│ Railway re-deploys ⚡    │
└──────────────────────────┘
            ↓
STEP 5: MUSIC
┌──────────────────────────┐
│ Upload music to Railway  │
│ /data/music/ folder      │
│ Bot loads songs! 🎵      │
└──────────────────────────┘
            ↓
STEP 6: LIVE 🎉
┌──────────────────────────┐
│ Bot online 24/7          │
│ Use /play commands       │
│ Music streams!           │
│ Success! 🚀              │
└──────────────────────────┘
```

---

## Costs & Credits

### Railway Free Tier
- **$5/month** in free credits
- **Resets monthly** (Jan 1, Feb 1, etc)

### Estimated Bot Cost
- Bot running 24/7: **~$3-4/month**
- Storage for music: **~$1/month** (depending on size)
- Total: **~$4-5/month** = **Just fits in free tier!** ✅

### Monitor Your Usage
```
Railway Dashboard → Account → Usage
```

---

## Security Checklist

```
Local Machine:
  ✅ .env file in .gitignore (secrets stay local)
  ✅ Don't share your bot token
  ✅ Don't commit .env to GitHub

GitHub:
  ✅ Use PRIVATE repository (keeps code private)
  ✅ Don't add bot token anywhere
  ✅ Use .env.example as template

Railway:
  ✅ Secrets stored in Variables tab (encrypted)
  ✅ Not visible in logs or code
  ✅ Can't be accessed by other users
  ✅ Rotatable (if token leaks, can regenerate)
```

---

## Key Advantages of Railway

| Feature | Local PC | Railway |
|---------|----------|---------|
| Bot uptime | ❌ Only when PC on | ✅ 24/7 |
| FFmpeg install | ⚠️ Manual setup | ✅ Pre-installed |
| Updates | ❌ Manual restart | ✅ Auto git push |
| Monitoring | ❌ Check logs manually | ✅ Dashboard |
| Cost | Free (electricity) | Free ($5/month credits) |
| Reliability | ⚠️ Depends on PC | ✅ Enterprise grade |

---

## Troubleshooting: Where to Check

```
Problem: Bot offline
  → Check: Railway Logs tab
  → Look for: Error messages in red

Problem: No audio playing
  → Check: Music files in Railway Files tab
  → Look for: Files in /data/music/

Problem: Commands don't work
  → Check: ADMIN_ROLE_ID is correct
  → Look for: User has role assigned

Problem: Variables not working
  → Check: Railway Variables tab
  → Look for: All 3 variables present (TOKEN, ROLE_ID, FOLDER)

Problem: Can't see deployment status
  → Check: Railway Deployments tab
  → Look for: Green checkmark (success)
```

---

## Common Git + Railway Workflow

### First Time
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOU/discord-music-bot.git
git push -u origin main
```

### Every Update
```bash
# Make changes to code
nano discord_music_bot.js  # Edit

# Push to GitHub (Railway auto-deploys!)
git add .
git commit -m "Fix: bug description"
git push
```

### Done! ✅
Railway detects new code → Auto-builds → Auto-deploys → No manual work!

---

## Quick Decision Tree

```
Do you want bot running 24/7?
  ├─ YES → Use Railway ⭐ (Recommended)
  └─ NO  → Run locally (Keep PC on)

Do you want easy updates?
  ├─ YES → Use GitHub + Railway (Auto-deploy on push)
  └─ NO  → Just local

Do you have $5/month budget?
  ├─ YES → Railway (Free tier covers bot cost)
  └─ NO  → Local (But Railway free tier gives $5/month anyway!)

Best option: GitHub + Railway + Free tier = Perfect! 🚀
```

---

**Start with:** `GITHUB_RAILWAY_QUICK_SETUP.md` for step-by-step instructions!
