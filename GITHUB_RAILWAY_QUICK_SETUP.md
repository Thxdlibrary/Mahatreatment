# GitHub + Railway: Step-by-Step Walkthrough

Complete guide to get your Discord bot running on Railway in under 10 minutes!

---

## Step 1: Prepare Your Local Files (2 minutes)

Make sure you have these files in your bot folder:

```
discord-music-bot/
├── discord_music_bot.js
├── package.json
├── .env.example
├── .gitignore
├── Procfile
├── Dockerfile
├── .dockerignore
├── README.md
└── music/
    └── (your music files here)
```

---

## Step 2: Create GitHub Repository (2 minutes)

### A. Create Repo on GitHub

1. Go to **https://github.com/new**
2. Enter repository name: `discord-music-bot`
3. Choose **"Private"** (keep your token secret!)
4. Click **"Create repository"**

### B. Get Your Git Commands

GitHub shows you commands. Copy them. They look like:

```
git remote add origin https://github.com/YOUR_USERNAME/discord-music-bot.git
git branch -M main
git push -u origin main
```

---

## Step 3: Push Code to GitHub (2 minutes)

Open Command Prompt/PowerShell in your bot folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Discord music bot ready for Railway"

# Add GitHub as remote (paste the command from Step 2.B)
git remote add origin https://github.com/YOUR_USERNAME/discord-music-bot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**You should see:** Files uploaded to GitHub ✅

---

## Step 4: Create Railway Account (2 minutes)

1. Go to **https://railway.app**
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"GitHub"** authentication (easiest)
4. Authorize Railway to access your GitHub

---

## Step 5: Deploy to Railway (1 minute)

### A. Start New Project

1. Click **"Create New Project"** or **"Start Project"**
2. Click **"Deploy from GitHub repo"**
3. Click **"Connect GitHub"** (if not already done)
4. Select **`discord-music-bot`** repository
5. Click **"Deploy"**

**Wait:** Railway builds and deploys (takes ~1-2 minutes)

### B. Monitor Deployment

Watch the **Logs** tab:

```
[Building...]
npm install
npm start
[Deployment successful!]
```

---

## Step 6: Add Environment Variables (2 minutes)

Railway needs to know your bot token and admin role ID!

### A. Get Your Values

**Discord Bot Token:**
1. Go to Discord Developer Portal
2. Select your application
3. Go to **"Bot"** section
4. Click **"Copy"** under TOKEN
5. Save it somewhere temporarily

**Admin Role ID:**
1. In Discord, enable Developer Mode (Settings → Advanced)
2. Right-click your admin role
3. Click **"Copy User ID"**
4. Save it

### B. Add to Railway

1. In Railway dashboard, click **"Variables"** tab
2. Click **"+ Add Variable"**
3. Add these THREE variables:

| Name | Value |
|------|-------|
| `DISCORD_TOKEN` | your_actual_token_here |
| `ADMIN_ROLE_ID` | your_role_id_here |
| `MUSIC_FOLDER` | /data/music |

4. Click **"Save"**

**Railway will auto-redeploy** ✅

---

## Step 7: Upload Music Files (1 minute)

### A. Via Railway Dashboard

1. Go to **"Files"** tab in Railway
2. Navigate to or create `/data/music` folder
3. Click **"Upload Files"** or drag & drop
4. Select your music files (MP3, WAV, OGG, FLAC)
5. Upload!

### Alternative: Via GitHub

1. Create `music/` folder locally
2. Add music files
3. Run:
   ```bash
   git add music/
   git commit -m "Add music files"
   git push
   ```
4. Railway auto-deploys with files

---

## Step 8: Verify Bot is Running (1 minute)

### A. Check Logs

In Railway dashboard → **Logs** tab, look for:

```
✅ Bot is online as YourBotName#0000
📁 Music folder: /data/music
🔐 Admin Role ID: 123456789
✅ Slash commands registered
```

If you see these → **Bot is ready!** 🎉

### B. Test in Discord

1. Go to your Discord server
2. Type `/play` and press space
3. Bot should suggest your command
4. Type song name: `/play relax`
5. Bot should join voice channel! 🎵

---

## Step 9: Make Updates (Future)

Whenever you want to update your bot:

```bash
# Make your code changes locally

# Commit and push
git add .
git commit -m "Update: describe your change"
git push
```

**That's it!** Railway automatically redeploys. No manual work needed!

---

## Troubleshooting

### Bot doesn't appear in Discord
- ❌ Make sure you invited bot to server
- ✅ Check bot has proper permissions

### Bot goes offline
- ❌ Check Logs tab in Railway
- ✅ Verify DISCORD_TOKEN is correct
- ✅ Check ADMIN_ROLE_ID is correct

### No audio playing
- ❌ Upload music files to `/data/music`
- ✅ Check file formats (MP3, WAV, OGG, FLAC)

### Can't see slash commands
- ❌ Check logs for registration errors
- ✅ Try typing `/` in Discord

### "Permission denied" errors
- ❌ Make sure bot has voice permissions
- ✅ Check bot role is high enough in role list

---

## Common Commands on Railway CLI

If you installed Railway CLI (`npm install -g @railway/cli`):

```bash
# View live logs
railway logs

# Check status
railway status

# Check variables
railway variables

# Run command
railway run node discord_music_bot.js
```

---

## Your Checklist ✅

- [ ] Files ready locally
- [ ] GitHub repo created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Bot deployed to Railway
- [ ] Environment variables set
- [ ] Music files uploaded
- [ ] Bot online in Discord
- [ ] Test `/play` command works

---

## Next Steps

1. **Invite friends** - They can use the bot if they have admin role
2. **Add more music** - Upload to `/data/music` on Railway
3. **Customize** - See `ADVANCED_CONFIG.md` for options
4. **Monitor** - Check Railway Logs occasionally

---

## You're Done! 🚀

Your Discord bot is now running 24/7 in the cloud!

- **Free** - No cost (uses $5/month Railway credits)
- **Always Online** - 24/7 uptime
- **Auto-Updating** - Push to GitHub, auto-deploy
- **Easy Management** - Railway dashboard

**Enjoy your cloud-powered music bot!** 🎵☁️

---

## Quick Reference

| Task | Time | How |
|------|------|-----|
| Setup GitHub | 2 min | Create repo, push code |
| Deploy to Railway | 1 min | Click "Deploy from GitHub" |
| Add Variables | 2 min | Railway Variables tab |
| Upload Music | 1 min | Railway Files tab |
| Test Bot | 1 min | Use `/play` command |
| **Total** | **~8 min** | From start to working bot |

---

**Questions?** See `RAILWAY_DEPLOYMENT.md` for more details.
