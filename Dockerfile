FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy bot code
COPY . .

# Create data directory for music and storage
RUN mkdir -p /data/music

# Run the bot
CMD ["node", "discord_music_bot.js"]
