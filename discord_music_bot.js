const { Client, GatewayIntentBits, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Tell @discordjs/voice where ffmpeg is (the npm package version)
process.env.FFMPEG_PATH = ffmpegPath;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

const CONFIG = {
  TOKEN: process.env.DISCORD_TOKEN,
  ADMIN_ROLE_ID: process.env.ADMIN_ROLE_ID || 'YOUR_ADMIN_ROLE_ID',
  MUSIC_FOLDER: process.env.MUSIC_FOLDER || './music',
};

const queues = new Map();
const players = new Map();
const stopped = new Set();

function isAdmin(member) {
  if (!member) return false;
  return member.roles.cache.has(CONFIG.ADMIN_ROLE_ID) || member.permissions.has(PermissionFlagsBits.Administrator);
}

function getQueue(guildId) {
  if (!queues.has(guildId)) queues.set(guildId, []);
  return queues.get(guildId);
}

function getAvailableMusic() {
  try {
    if (!fs.existsSync(CONFIG.MUSIC_FOLDER)) {
      fs.mkdirSync(CONFIG.MUSIC_FOLDER, { recursive: true });
      return [];
    }
    return fs.readdirSync(CONFIG.MUSIC_FOLDER).filter(f =>
      /\.(mp3|wav|ogg|flac)$/i.test(f)
    );
  } catch (err) {
    console.error('Error reading music folder:', err);
    return [];
  }
}

async function playNextSong(guildId, voiceChannel) {
  if (stopped.has(guildId)) return;

  const queue = getQueue(guildId);

  if (queue.length === 0) {
    const conn = getVoiceConnection(guildId);
    if (conn) conn.destroy();
    players.delete(guildId);
    console.log(`Queue empty, disconnected from guild ${guildId}`);
    return;
  }

  const songName = queue.shift();
  const songPath = path.join(CONFIG.MUSIC_FOLDER, songName);
  console.log(`Attempting to play: ${songPath}`);

  if (!fs.existsSync(songPath)) {
    console.error(`File not found: ${songPath}`);
    return playNextSong(guildId, voiceChannel);
  }

  try {
    let connection = getVoiceConnection(guildId);
    if (!connection) {
      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      console.log(`Joined voice channel: ${voiceChannel.name}`);
    }

    if (!players.has(guildId)) {
      const player = createAudioPlayer();
      players.set(guildId, player);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        if (!stopped.has(guildId)) {
          playNextSong(guildId, voiceChannel);
        }
      });

      player.on('error', error => {
        console.error('Player error:', error.message, error.resource?.metadata);
        playNextSong(guildId, voiceChannel);
      });
    }

    const player = players.get(guildId);

    // Use ffmpeg-static path explicitly in the resource
    const resource = createAudioResource(songPath, {
      inlineVolume: false,
    });

    player.play(resource);
    console.log(`▶️ Now playing: ${songName}`);

  } catch (err) {
    console.error('Error in playNextSong:', err);
    playNextSong(guildId, voiceChannel);
  }
}

client.once('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  console.log(`📁 Music folder: ${CONFIG.MUSIC_FOLDER}`);
  console.log(`🔐 Admin Role ID: ${CONFIG.ADMIN_ROLE_ID}`);
  console.log(`🎵 FFmpeg path: ${ffmpegPath}`);

  // Log available songs at startup
  const songs = getAvailableMusic();
  console.log(`🎶 Found ${songs.length} song(s): ${songs.join(', ') || 'none'}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (!isAdmin(interaction.member)) {
    return interaction.reply({
      content: '❌ You do not have permission to use this command. Admin role required.',
      ephemeral: true,
    });
  }

  const { commandName } = interaction;
  const guildId = interaction.guildId;

  if (commandName === 'play') {
    await interaction.deferReply();

    const songName = interaction.options.getString('song');
    const voiceChannel = interaction.member?.voice.channel;

    if (!voiceChannel) {
      return interaction.editReply('❌ You must be in a voice channel to play music.');
    }

    const musicFiles = getAvailableMusic();
    console.log(`Available songs: ${musicFiles.join(', ')}`);

    const matching = musicFiles.filter(f =>
      f.toLowerCase().includes(songName.toLowerCase())
    );

    if (matching.length === 0) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Song Not Found')
        .setDescription(`No songs found matching "${songName}"`)
        .addFields({
          name: 'Available songs:',
          value: musicFiles.length > 0
            ? musicFiles.slice(0, 10).map((f, i) => `${i + 1}. ${f}`).join('\n')
            : 'No songs in music folder',
        });
      return interaction.editReply({ embeds: [embed] });
    }

    stopped.delete(guildId);
    const queue = getQueue(guildId);
    matching.forEach(song => queue.push(song));

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ Added to Queue')
      .setDescription(`Added ${matching.length} song(s)`)
      .addFields(
        { name: 'Songs added:', value: matching.join('\n') },
        { name: 'Queue position:', value: `${queue.length - matching.length + 1} - ${queue.length}` }
      );

    await interaction.editReply({ embeds: [embed] });

    const existingPlayer = players.get(guildId);
    if (!existingPlayer || existingPlayer.state.status === AudioPlayerStatus.Idle) {
      playNextSong(guildId, voiceChannel);
    }
  }

  else if (commandName === 'stop') {
    stopped.add(guildId);
    queues.set(guildId, []);

    const player = players.get(guildId);
    if (player) {
      player.stop(true);
      players.delete(guildId);
    }

    const connection = getVoiceConnection(guildId);
    if (connection) connection.destroy();

    interaction.reply('⏹️ Music stopped and queue cleared.');
  }

  else if (commandName === 'pause') {
    const player = players.get(guildId);
    if (!player) return interaction.reply({ content: '❌ Not playing anything.', ephemeral: true });
    player.pause();
    interaction.reply('⏸️ Paused.');
  }

  else if (commandName === 'resume') {
    const player = players.get(guildId);
    if (!player) return interaction.reply({ content: '❌ Not playing anything.', ephemeral: true });
    player.unpause();
    interaction.reply('▶️ Resumed.');
  }

  else if (commandName === 'skip') {
    const player = players.get(guildId);
    if (!player) return interaction.reply({ content: '❌ Not playing anything.', ephemeral: true });
    stopped.delete(guildId);
    player.stop();
    interaction.reply('⏭️ Skipped.');
  }

  else if (commandName === 'queue') {
    const queue = getQueue(guildId);
    if (queue.length === 0) return interaction.reply({ content: '📭 Queue is empty.', ephemeral: true });
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🎵 Music Queue')
      .setDescription(queue.slice(0, 25).map((s, i) => `${i + 1}. ${s}`).join('\n'))
      .setFooter({ text: `Total: ${queue.length} song(s)` });
    interaction.reply({ embeds: [embed] });
  }

  else if (commandName === 'list') {
    const musicFiles = getAvailableMusic();
    if (musicFiles.length === 0) return interaction.reply({ content: '📭 No songs found.', ephemeral: true });
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🎵 Available Songs')
      .setDescription(musicFiles.slice(0, 25).map((s, i) => `${i + 1}. ${s}`).join('\n'))
      .setFooter({ text: `Total: ${musicFiles.length} song(s)` });
    interaction.reply({ embeds: [embed] });
  }
});

client.once('ready', async () => {
  try {
    const commands = [
      new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from the music folder')
        .addStringOption(o => o.setName('song').setDescription('Song name or partial name').setRequired(true)),
      new SlashCommandBuilder().setName('stop').setDescription('Stop playing music and clear queue'),
      new SlashCommandBuilder().setName('pause').setDescription('Pause the current song'),
      new SlashCommandBuilder().setName('resume').setDescription('Resume playing music'),
      new SlashCommandBuilder().setName('skip').setDescription('Skip to the next song'),
      new SlashCommandBuilder().setName('queue').setDescription('View the current music queue'),
      new SlashCommandBuilder().setName('list').setDescription('List all available songs'),
    ];
    await client.application.commands.set(commands);
    console.log('✅ Slash commands registered');
  } catch (err) {
    console.error('Error registering commands:', err);
  }
});

client.login(CONFIG.TOKEN);

process.on('SIGINT', () => {
  client.guilds.cache.forEach(guild => {
    const conn = getVoiceConnection(guild.id);
    if (conn) conn.destroy();
  });
  client.destroy();
  process.exit(0);
});
