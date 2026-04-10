# 🚀 Discord Bot on Railway - Quick Start Card

## 📋 Your Checklist (Do These in Order)

### ✅ Step 1: Prepare Files (1 min)
Make sure you have all these files:
- `discord_music_bot.js` (the bot code)
- `package.json` (dependencies)
- `Procfile` (tells Railway what to run)
- `Dockerfile` (container setup)
- `.gitignore` (keeps secrets safe)

### ✅ Step 2: Create GitHub Repo (2 min)

```bash
# In your bot folder, run these commands:
git init
git add .
git commit -m "Discord music bot"
git remote add origin https://github.com/YOUR_USERNAME/discord-music-bot.git
git branch -M main
git push -u origin main
```

### ✅ Step 3: Deploy to Railway (1 min)

1. Go to **https://railway.app**
2. Click **"Start Project"**
3. Click **"Deploy from GitHub repo"**
4. Select your `discord-music-bot` repo
5. Click **"Deploy"**

**Railway is building... (takes 1-2 min)** ⏳

### ✅ Step 4: Add Your Secrets (2 min)

In Railway dashboard, go to **Variables** tab and add:

| Name | Value |
|------|-------|
| `DISCORD_TOKEN` | Get from Discord Developer Portal |
| `ADMIN_ROLE_ID` | Right-click role in Discord (copy ID) |
| `MUSIC_FOLDER` | `/data/music` |

Click **Save** → Railway re-deploys automatically ✅

### ✅ Step 5: Upload Music (1 min)

In Railway dashboard, go to **Files** tab:
1. Create folder: `/data/music`
2. Upload your music files (MP3, WAV, OGG, FLAC)

### ✅ Step 6: Test It! (1 min)

1. Check **Logs** tab - should see:
   ```
   ✅ Bot is online as YourBotName#0000
   ✅ Slash commands registered
   ```

2. Go to Discord, type `/play` and try it!

3. Bot should join your voice channel 🎵

---

## 📊 Time Breakdown

| Task | Time |
|------|------|
| Step 1: Files | 1 min |
| Step 2: GitHub | 2 min |
| Step 3: Railway Deploy | 3 min |
| Step 4: Add Secrets | 2 min |
| Step 5: Upload Music | 1 min |
| Step 6: Test | 1 min |
| **TOTAL** | **~10 min** ⚡ |

---

## 🔗 Important Links

| What | Link |
|-----|------|
| Discord Token | https://discord.com/developers/applications |
| Railway | https://railway.app |
| GitHub | https://github.com |

---

## 💡 Pro Tips

### Getting Your IDs

**DISCORD_TOKEN:**
1. Discord Developer Portal → Your App
2. Bot section → Copy TOKEN

**ADMIN_ROLE_ID:**
1. Enable Developer Mode (Discord Settings → Advanced)
2. Right-click admin role → Copy User ID

### Updating Your Bot

Just push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Railway **auto-deploys** automatically! 🚀 No manual work needed!

### Adding More Music

Railway Files tab → Upload to `/data/music`

### Bot Keeps Running

Railway keeps your bot online 24/7, even if your PC is off! ☁️

---

## ⚠️ Common Mistakes

❌ **Don't:** Commit your `.env` file to GitHub  
✅ **Do:** Use Railway Variables tab instead

❌ **Don't:** Forget the ADMIN_ROLE_ID (bot won't authenticate admins)  
✅ **Do:** Copy the actual role ID from Discord

❌ **Don't:** Upload music files to GitHub  
✅ **Do:** Upload to Railway's `/data/music` folder

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot offline | Check Railway Logs |
| No sound | Upload music to `/data/music` |
| Commands don't work | Check ADMIN_ROLE_ID is correct |
| Permission denied errors | Verify bot has voice permissions in Discord |

---

## 📚 Need More Help?

- **Full setup guide:** See `SETUP_GUIDE.md`
- **All commands:** See `QUICK_REFERENCE.md`
- **Customize features:** See `ADVANCED_CONFIG.md`
- **How it works:** See `ARCHITECTURE_OVERVIEW.md`
- **Index/Navigation:** See `INDEX.md`

---

## ✅ You're All Set!

Follow these 6 steps and your bot will be:
- ✅ Online 24/7
- ✅ Playing music in Discord
- ✅ Admin-only access
- ✅ Easy to update

**Start with Step 1 above!** 🚀

---

**Questions?** Most answers are in `INDEX.md` - choose your path!
