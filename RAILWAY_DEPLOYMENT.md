# Deploy Discord Music Bot to Railway via GitHub

Deploy your bot to the cloud in minutes! No need for FFmpeg installation on your machine.

## Why Railway?

✅ **Free tier** - $5/month free credits  
✅ **Auto-restart** - Bot stays online 24/7  
✅ **GitHub integration** - Auto-deploy on code changes  
✅ **Easy environment variables** - Manage secrets securely  
✅ **Pre-installed dependencies** - FFmpeg already available  

---

## Prerequisites

- GitHub account (free)
- Railway account (free) - https://railway.app
- Your bot code ready

---

## Step 1: Push Code to GitHub

### Create a GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `discord-music-bot`
3. Description: `Admin-only Discord music bot with Railway deployment`
4. Click **"Create repository"**

### Push Your Bot Code

On your local machine, in your bot folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Discord music bot"

# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/discord-music-bot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Prepare for Railway

### Update .env File

Create a **.gitignore** file to keep secrets safe:

```
node_modules/
.env
music/
play_history.json
queue_backup.json
```

Save this as `.gitignore` in your bot folder.

### Create .env.railway

Create **.env.railway** with placeholder values:

```
DISCORD_TOKEN=your_token_here
ADMIN_ROLE_ID=your_role_id_here
MUSIC_FOLDER=/data/music
```

### Add Procfile

Create a file named **Procfile** (no extension):

```
worker: node discord_music_bot.js
```

This tells Railway how to run your bot.

---

## Step 3: Set Up Dockerization (Optional but Recommended)

Create a **Dockerfile**:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy bot code
COPY . .

# Create music directory
RUN mkdir -p /data/music

# Run the bot
CMD ["node", "discord_music_bot.js"]
```

Create **.dockerignore**:

```
node_modules
.env
.git
.gitignore
music
play_history.json
queue_backup.json
README.md
SETUP_GUIDE.md
QUICK_REFERENCE.md
ADVANCED_CONFIG.md
```

---

## Step 4: Connect GitHub to Railway

### 1. Sign Up for Railway

1. Go to **https://railway.app**
2. Click **"Start Project"**
3. Click **"Deploy from GitHub repo"**

### 2. Connect GitHub

1. Click **"Connect GitHub"**
2. Authorize Railway to access your GitHub account
3. Select your **discord-music-bot** repository
4. Click **"Deploy"**

Railway will now build and deploy your bot! 🚀

---

## Step 5: Set Environment Variables on Railway

### Add Your Secrets

1. After Railway creates your project, go to the **Variables** tab
2. Click **"+ Add Variable"**
3. Add these variables:

```
DISCORD_TOKEN = your_actual_bot_token
ADMIN_ROLE_ID = your_actual_admin_role_id
MUSIC_FOLDER = /data/music
```

- Get `DISCORD_TOKEN` from Discord Developer Portal
- Get `ADMIN_ROLE_ID` by right-clicking your role in Discord (with Developer Mode enabled)

### Save Variables

Click **"Save"** - Railway will automatically redeploy with the new variables.

---

## Step 6: Add Music Files to Railway

### Option A: Upload via Railway Dashboard (Easiest)

1. In Railway, go to the **Files** tab
2. Click **"Add File"**
3. Navigate to `/data/music` folder
4. Upload your music files

### Option B: Use Storage Plugin

1. In Railway, click **"Plugins"**
2. Add **"Disk"** plugin
3. Set mount path to `/data/music`
4. Upload files through the file browser

### Option C: Add to GitHub (Simple)

1. Create `music/` folder in your GitHub repo
2. Add your music files
3. Commit and push
4. Railway will deploy with files included

```bash
git add music/
git commit -m "Add music files"
git push
```

---

## Step 7: Verify Bot is Running

### Check Logs

1. In Railway dashboard, click **"Logs"**
2. You should see:
   ```
   ✅ Bot is online as YourBotName#0000
   📁 Music folder: /data/music
   🔐 Admin Role ID: your_role_id
   ✅ Slash commands registered
   ```

### Test the Bot

1. Go to your Discord server
2. Try `/play songname`
3. Bot should join your voice channel! 🎵

---

## Updating Your Bot

### After Making Changes Locally

```bash
# Make your changes
# Update code in your editor

# Commit and push
git add .
git commit -m "Update: add new feature"
git push
```

Railway will **automatically redeploy** your bot! 🚀

---

## File Structure for Railway

```
discord-music-bot/
├── discord_music_bot.js       (main bot file)
├── package.json
├── .env                        (DON'T COMMIT - use Railway Variables instead)
├── .gitignore
├── Procfile                    (tells Railway how to run)
├── Dockerfile                  (optional, for better control)
├── .dockerignore              (optional)
├── music/                      (your music files)
│   ├── song1.mp3
│   ├── song2.wav
│   └── ...
├── SETUP_GUIDE.md
├── QUICK_REFERENCE.md
├── ADVANCED_CONFIG.md
└── README.md
```

---

## Railway Free Tier

- **$5/month free credits**
- Enough for continuous bot running (~2 GB memory)
- Monthly resets

### Cost Breakdown
- Bot running 24/7: ~$3-4/month
- Leave room for storage and other services

To monitor usage:
1. Go to Railway dashboard
2. Click **"Account"**
3. See your usage and credits

---

## Troubleshooting on Railway

### Bot Goes Offline

**Check Logs:**
1. Railway Dashboard → Logs
2. Look for error messages
3. Common issues:
   - Invalid `DISCORD_TOKEN` → Check Discord Developer Portal
   - Invalid `ADMIN_ROLE_ID` → Re-copy from Discord
   - Missing music folder → Upload files to `/data/music`

### Bot Can't Read Music Files

Make sure music folder path in code matches Railway path:
```javascript
// In discord_music_bot.js
MUSIC_FOLDER: process.env.MUSIC_FOLDER || '/data/music',
```

### Environment Variables Not Loading

1. Go to Railway Variables tab
2. Check spelling matches your code
3. Click **"Save"**
4. Wait for redeploy (check Logs tab)

### Redeploy Manually

If Railway doesn't auto-deploy:
1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click the **"Re-deploy"** button

---

## Advanced: Add Redis for Queue Persistence

If you want queue to survive bot restarts:

1. In Railway, click **"Plugins"** → **"Add Plugins"**
2. Add **"Redis"**
3. Update your code to use Redis (see ADVANCED_CONFIG.md)

---

## GitHub Actions (Optional Automation)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy with Railway
        uses: railwayapp/deploy-action@v1
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

Get `RAILWAY_TOKEN` from Railway settings and add to GitHub Secrets.

---

## Keep Bot Running Forever

Railway handles this automatically! Your bot will:
- ✅ Auto-restart if it crashes
- ✅ Stay online 24/7
- ✅ Handle Discord reconnections
- ✅ Persist across Railway restarts

No need to keep your computer running! 💻

---

## Quick Reference: Railway Commands

```bash
# View logs
railway logs

# See status
railway status

# Run commands
railway run node discord_music_bot.js
```

Install Railway CLI:
```bash
npm install -g @railway/cli
```

---

## Support & Help

**Railway Docs:** https://docs.railway.app
**Discord.js Docs:** https://discord.js.org
**Questions?** Check SETUP_GUIDE.md and ADVANCED_CONFIG.md

---

## Summary

✅ Push code to GitHub  
✅ Connect to Railway  
✅ Set environment variables  
✅ Upload music files  
✅ Bot runs 24/7 in the cloud  
✅ Updates auto-deploy  

**That's it! Your bot is now in the cloud.** 🚀🎵
