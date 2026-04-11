FROM node:18-alpine

WORKDIR /app

# BUG FIX #1: Install FFmpeg (required for audio encoding)
# BUG FIX #2: Install python3 + build tools needed to compile @discordjs/opus
RUN apk add --no-cache ffmpeg python3 make g++

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including opus encoder)
RUN npm install --omit=dev

# Copy bot code
COPY . .

# Create data directory for music
RUN mkdir -p /data/music

CMD ["node", "discord_music_bot.js"]
