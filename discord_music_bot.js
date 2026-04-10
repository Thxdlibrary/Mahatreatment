const { Client, GatewayIntentBits, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// Configuration
const CONFIG = {
  TOKEN: process.env.DISCORD_TOKEN,
  ADMIN_ROLE_ID: process.env.ADMIN_ROLE_ID || 'YOUR_ADMIN_ROLE_ID',
  MUSIC_FOLDER: process.env.MUSIC_FOLDER || './music',
};

// Queue management
const queues = new Map();
const players = new Map();
const connections = new Map();

/**
 * Check if user has admin role
 */
function isAdmin(member) {
  if (!member) return false;
  return member.roles.cache.has(CONFIG.ADMIN_ROLE_ID) || member.permissions.has(PermissionFlagsBits.Administrator);
}

/**
 * Get or create queue for guild
 */
function getQueue(guildId) {
  if (!queues.has(guildId)) {
    queues.set(guildId, []);
  }
  return queues.get(guildId);
}

/**
 * Get all available music files
 */
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

/**
 * Play next song in queue
 */
async function playNextSong(guildId, voiceChannel, interaction) {
  const queue = getQueue(guildId);
  
  if (queue.length === 0) {
    // Queue is empty, disconnect
    const connection = connections.get(guildId);
    if (connection) {
      connection.destroy();
      connections.delete(guildId);
    }
    if (players.has(guildId)) {
      players.get(guildId).stop();
      players.delete(guildId);
    }
    return;
  }

  const songName = queue.shift();
  const songPath = path.join(CONFIG.MUSIC_FOLDER, songName);

  try {
    if (!fs.existsSync(songPath)) {
      console.error(`Song file not found: ${songPath}`);
      return playNextSong(guildId, voiceChannel, interaction);
    }

    // Get or create connection
    let connection = connections.get(guildId);
    if (!connection) {
      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      connections.set(guildId, connection);
    }

    // Create player if doesn't exist
    if (!players.has(guildId)) {
      const player = createAudioPlayer();
      players.set(guildId, player);
      connection.subscribe(player);

      // When song ends, play next
      player.on(AudioPlayerStatus.Idle, () => {
        playNextSong(guildId, voiceChannel, interaction);
      });

      player.on('error', error => {
        console.error('Player error:', error);
        playNextSong(guildId, voiceChannel, interaction);
      });
    }

    const player = players.get(guildId);
    const resource = createAudioResource(songPath);
    
    player.play(resource);

    if (interaction) {
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎵 Now Playing')
        .setDescription(`**${songName}**`)
        .setFooter({ text: `Queue: ${queue.length} song(s) remaining` });
      
      interaction.reply({ embeds: [embed] }).catch(() => {});
    }
  } catch (err) {
    console.error('Error playing song:', err);
    playNextSong(guildId, voiceChannel, interaction);
  }
}

client.once('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  console.log(`📁 Music folder: ${CONFIG.MUSIC_FOLDER}`);
  console.log(`🔐 Admin Role ID: ${CONFIG.ADMIN_ROLE_ID}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Admin check
  if (!isAdmin(interaction.member)) {
    return interaction.reply({
      content: '❌ You do not have permission to use this command. Admin role required.',
      ephemeral: true,
    });
  }

  const { commandName } = interaction;
  const guildId = interaction.guildId;

  // ============ PLAY COMMAND ============
  if (commandName === 'play') {
    await interaction.deferReply();

    const songName = interaction.options.getString('song');
    const voiceChannel = interaction.member?.voice.channel;

    if (!voiceChannel) {
      return interaction.editReply('❌ You must be in a voice channel to play music.');
    }

    const musicFiles = getAvailableMusic();
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

    const queue = getQueue(guildId);
    matching.forEach(song => queue.push(song));

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ Added to Queue')
      .setDescription(`Added ${matching.length} song(s)`)
      .addFields({
        name: 'Songs added:',
        value: matching.join('\n'),
      }, {
        name: 'Queue position:',
        value: `${queue.length - matching.length + 1} - ${queue.length}`,
      });

    await interaction.editReply({ embeds: [embed] });

    // If not currently playing, start playing
    if (!players.has(guildId) || players.get(guildId).state.status === AudioPlayerStatus.Idle) {
      playNextSong(guildId, voiceChannel, interaction);
    }
  }

  // ============ STOP COMMAND ============
  else if (commandName === 'stop') {
    const voiceChannel = interaction.member?.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: '❌ You must be in a voice channel.',
        ephemeral: true,
      });
    }

    const connection = connections.get(guildId);
    const player = players.get(guildId);

    if (!connection && !player) {
      return interaction.reply({
        content: '❌ Bot is not playing any music.',
        ephemeral: true,
      });
    }

    // Clear queue and stop
    queues.set(guildId, []);
    if (player) player.stop();
    if (connection) connection.destroy();

    connections.delete(guildId);
    players.delete(guildId);

    interaction.reply('⏹️ Music stopped and queue cleared.');
  }

  // ============ PAUSE COMMAND ============
  else if (commandName === 'pause') {
    const player = players.get(guildId);

    if (!player) {
      return interaction.reply({
        content: '❌ Bot is not playing any music.',
        ephemeral: true,
      });
    }

    player.pause();
    interaction.reply('⏸️ Music paused.');
  }

  // ============ RESUME COMMAND ============
  else if (commandName === 'resume') {
    const player = players.get(guildId);

    if (!player) {
      return interaction.reply({
        content: '❌ Bot is not playing any music.',
        ephemeral: true,
      });
    }

    player.unpause();
    interaction.reply('▶️ Music resumed.');
  }

  // ============ SKIP COMMAND ============
  else if (commandName === 'skip') {
    const player = players.get(guildId);

    if (!player) {
      return interaction.reply({
        content: '❌ Bot is not playing any music.',
        ephemeral: true,
      });
    }

    player.stop();
    interaction.reply('⏭️ Skipped to next song.');
  }

  // ============ QUEUE COMMAND ============
  else if (commandName === 'queue') {
    const queue = getQueue(guildId);

    if (queue.length === 0) {
      return interaction.reply({
        content: '📭 Queue is empty.',
        ephemeral: true,
      });
    }

    const queueList = queue.slice(0, 25).map((song, i) => `${i + 1}. ${song}`).join('\n');
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🎵 Music Queue')
      .setDescription(queueList)
      .setFooter({ text: `Total: ${queue.length} song(s)` });

    interaction.reply({ embeds: [embed] });
  }

  // ============ LIST COMMAND ============
  else if (commandName === 'list') {
    const musicFiles = getAvailableMusic();

    if (musicFiles.length === 0) {
      return interaction.reply({
        content: '📭 No songs available in music folder.',
        ephemeral: true,
      });
    }

    const songList = musicFiles.slice(0, 25).map((song, i) => `${i + 1}. ${song}`).join('\n');
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🎵 Available Songs')
      .setDescription(songList)
      .setFooter({ text: `Total: ${musicFiles.length} song(s)` });

    interaction.reply({ embeds: [embed] });
  }
});

// Register slash commands
client.once('ready', async () => {
  try {
    const commands = [
      new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from the music folder')
        .addStringOption(option =>
          option
            .setName('song')
            .setDescription('Song name or partial name')
            .setRequired(true)
        ),

      new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing music and clear queue'),

      new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song'),

      new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume playing music'),

      new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip to the next song'),

      new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the current music queue'),

      new SlashCommandBuilder()
        .setName('list')
        .setDescription('List all available songs'),
    ];

    await client.application.commands.set(commands);
    console.log('✅ Slash commands registered');
  } catch (err) {
    console.error('Error registering commands:', err);
  }
});

client.login(CONFIG.TOKEN);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  connections.forEach(conn => conn.destroy());
  players.forEach(player => player.stop());
  client.destroy();
  process.exit(0);
});
