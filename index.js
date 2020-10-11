const fs = require('fs');
const Discord = require('discord.js');
const { version, prefix, token } = require('./config.json');

const { Server } = require('http');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    // sendToAllLogChannel(`Bot successfully started on: ${new Date().toLocaleString()}`);

    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    // Check if bot is called of bot-prefix is used in message.
    if (!msg.content.startsWith(prefix) || msg.author.bot) {
        return;
    }

    // Create a 'commandName' string that can call command. Also create the 'args' command for any arguments used for this command.
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check if commandName exists in ./commands
    if (!client.commands.has(commandName)) {
        console.log(`Command '${commandName}' was used, but could not be found.`);
        return;
    }

    // Create a command object and check if this command requires arguments.
    const command = client.commands.get(commandName);
    if (command.args && !args.length) {
        return msg.channel.send(`Deze command heeft arguments nodig, ${msg.author}!`);
    }

    // Run command
    try {
        client.commands.get(commandName).execute(msg, args);
    } catch (error) {
        console.error(error);
    }
});

/**
 * Sends a message to the log channel of this bot.
 * @param {string} msg message
 * @param {string} color color in hex (#ffffff)
 */
function sendToAllLogChannel(msg, color) {
    if (color === undefined) {
        color = '#ff3333';
    }
    const guildLists = client.guilds.cache.array();

    guildLists.forEach(guild => {
        const channel = guild.channels.cache.find(channel => channel.name === 'log-karen');

        if (channel) {
            const msgEmbed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle('Assistent Karen')
                .setURL('https://github.com/jpmsen/assistent-bot')
                .setAuthor('by KnifeKillah#7470', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/26/269e0405d072bc194ac3697b73bba9fea84fbe51_full.jpg')
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`An assistent (bot, but do **not** tell her) that includes Quality of Life updates created with love for a specific server <3`)
                .addField('Status Bot', `${msg}`)
                .setFooter(`Assistent Karen | Version ${version}`)
                .setTimestamp();
            channel.send(msgEmbed);
        }
    });
}

client.login(token);