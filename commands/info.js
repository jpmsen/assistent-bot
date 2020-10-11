const Discord = require('discord.js');

module.exports = {
    name: 'info',
    description: 'Sends the current information about the bot',
    args: false,
    message: false,
    execute(message, args) {
        const channel = message.channel.guild.channels.cache.find(channel => channel.name === 'log-karen');

        const client = message.channel.guild.members.cache.find(user => user.id === '755114060546310264');

        if (channel) {
            const msgEmbed = new Discord.MessageEmbed()
                .setColor('ff3333')
                .setTitle('Assistent Karen')
                .setURL('https://github.com/jpmsen/assistent-bot')
                .setAuthor('by KnifeKillah#7470', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/26/269e0405d072bc194ac3697b73bba9fea84fbe51_full.jpg')
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`An assistent (bot, but do **not** tell her) that includes Quality of Life updates created with love for a specific server <3`)
                .addField('Status Bot', `Bot successfully started on: ${new Date().toLocaleString()}`)
                .setFooter('Assistent Karen | Version 1.0.0')
                .setTimestamp();
            channel.send(msgEmbed);
        }
    }
}