FROM node:18

WORKDIR /app

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy bot code
COPY . .

# Create data directory
RUN mkdir -p /data/music

# Start bot
CMD ["node", "discord_music_bot.js"]
