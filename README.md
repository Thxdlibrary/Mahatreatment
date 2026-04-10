# Discord Music Bot 🎵

An admin-only Discord bot that plays music in voice channels with a complete queue management system. Deploy to Railway for 24/7 uptime!

## Features

✅ **Admin-Only Commands** - Control who can use the bot  
✅ **Music Queue System** - Queue multiple songs  
✅ **Full Playback Control** - Play, pause, resume, skip  
✅ **Smart Song Matching** - Partial name search  
✅ **24/7 Uptime** - Deploy on Railway  
✅ **Easy Updates** - Push to GitHub, auto-deploy  
✅ **Multiple Formats** - MP3, WAV, OGG, FLAC  

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your DISCORD_TOKEN and ADMIN_ROLE_ID

# 3. Add music files to ./music folder

# 4. Start the bot
npm start
```

## Quick Start (Railway - Cloud Deployment) 🚀

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/discord-music-bot.git
git branch -M main
git push -u origin main
```

### 2. Connect to Railway

1. Go to **https://railway.app**
2. Click **"Start Project"** → **"Deploy from GitHub repo"**
3. Select your `discord-music-bot` repository
4. Railway auto-deploys! 🚀

### 3. Set Environment Variables

In Railway dashboard:
1. Go to **Variables** tab
2. Add:
   ```
   DISCORD_TOKEN = your_bot_token
   ADMIN_ROLE_ID = your_admin_role_id
   MUSIC_FOLDER = /data/music
   ```
3. Save → Auto-redeploy

### 4. Upload Music Files

1. Railway dashboard → **Files** tab
2. Create `/data/music` folder
3. Upload your music files

### 5. Verify

Check **Logs** tab:
```
✅ Bot is online as YourBotName#0000
✅ Slash commands registered
```

## Commands

| Command | Description |
|---------|-------------|
| `/play [song]` | Play a song (adds to queue) |
| `/stop` | Stop playing & clear queue |
| `/pause` | Pause current song |
| `/resume` | Resume paused song |
| `/skip` | Skip to next song |
| `/queue` | View music queue |
| `/list` | List available songs |

All commands are **admin-only**!

## Project Structure

```
discord-music-bot/
├── discord_music_bot.js       # Main bot code
├── package.json               # Dependencies
├── Procfile                   # Railway config
├── Dockerfile                 # Container config
├── .env.example              # Template
├── .gitignore                # Git ignore
├── music/                    # Your music files
└── docs/
    ├── SETUP_GUIDE.md
    ├── QUICK_REFERENCE.md
    ├── ADVANCED_CONFIG.md
    └── RAILWAY_DEPLOYMENT.md
```

## Setup Instructions

- **Local Setup**: See `SETUP_GUIDE.md`
- **Railway Deployment**: See `RAILWAY_DEPLOYMENT.md`
- **Command Reference**: See `QUICK_REFERENCE.md`
- **Advanced Config**: See `ADVANCED_CONFIG.md`
- **FFmpeg Windows**: See `FFMPEG_INSTALL_WINDOWS.md`

## Prerequisites

### For Local Running
- Node.js v16.9.0+
- FFmpeg (Windows: manual install, Linux: `apt install ffmpeg`)
- Discord bot token
- Admin role ID

### For Railway
- GitHub account (free)
- Railway account (free tier: $5/month credits)
- Discord bot token
- Admin role ID

## Getting Your IDs

### Discord Bot Token
1. Discord Developer Portal → Your App → Bot
2. Copy TOKEN
3. Add to `.env` or Railway Variables

### Admin Role ID
1. Enable Developer Mode in Discord
2. Right-click your admin role
3. Click "Copy User ID"
4. Add to `.env` or Railway Variables

## Deployment Comparison

| Feature | Local | Railway |
|---------|-------|---------|
| Setup Time | 10 min | 5 min |
| 24/7 Uptime | ❌ Need PC on | ✅ Always online |
| FFmpeg Install | ⚠️ Manual | ✅ Pre-installed |
| Auto Updates | ❌ Manual | ✅ Git push auto-deploys |
| Cost | Free | Free ($5/month credits) |
| Difficulty | Easy | Very Easy |

**Recommended: Use Railway for 24/7 uptime!**

## Troubleshooting

### Bot offline on Railway
→ Check Logs tab for errors

### Commands not working
→ Verify user has admin role

### No audio playing
→ Check music files are in `/data/music`

### Bot doesn't respond
→ Use `/` to trigger slash commands

## Support

- **Setup Help**: Check `SETUP_GUIDE.md`
- **Railway Docs**: https://docs.railway.app
- **Discord.js Docs**: https://discord.js.org

## License

MIT

## Contributing

1. Fork the repo
2. Make changes
3. Push to GitHub
4. Railway auto-deploys! 🚀

---

**Made with ❤️ for Discord admins everywhere**

Start with `RAILWAY_DEPLOYMENT.md` for cloud deployment! ☁️
