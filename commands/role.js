const Discord = require('discord.js')

module.exports = {
    name: 'role',
    description: 'Adds or removes a role to a user profile.',
    args: true,
    execute(message, args) {
        const roleGuild = message.guild.roles.cache.find(role => role.name.toLowerCase().startsWith(args[0].toLowerCase()));

        // If the role is found in discord server, run a check on role list of user. Else send a message to user that role does not exist.
        if (roleGuild) {
            const roleUser = message.member.roles.cache.find(role => role.name.toLowerCase().startsWith(args[0].toLowerCase()));

            // if the role is found on user, delete it. Else add role to user.
            if (roleUser) {
                message.member.roles.remove(roleGuild).then(() => {
                    message.channel.send(`<@${message.author.id}> De role '**${roleGuild.name}**' is van jouw profiel verwijderd!`);
                    sendToLogChannel(message, `<@${msg.author.id}> heeft de role '**${roleGuild.name}**' van zijn/haar profiel verwijderd.`, '#4d88ff');
                }).catch(err => {
                    message.channel.send(`<@${message.author.id}> Je hebt geen toestemming om jezelf '**${roleGuild.name}**' als rol te geven. Helaas pindakaas!`);
                    sendToLogChannel(message, `<@${message.author.id}> probeerde de rol '**${roleGuild.name}**' aan zichzelf toe te kennen.`, '#4d88ff');
                })

            } else {
                message.member.roles.add(roleGuild).then(() => {
                    message.channel.send(`<@${message.author.id}> De role '**${roleGuild.name}**' is toegevoegd aan je profiel!`);
                    sendToLogChannel(message, `<@${message.author.id}> heeft de role '**${roleGuild.name}**' toegevoegd aan zijn/haar profiel.`, '#4d88ff');
                }).catch(err => {
                    message.channel.send(`<@${message.author.id}> Je hebt geen toestemming om jezelf '**${roleGuild.name}**' als rol te geven. Helaas pindakaas!`);
                    sendToLogChannel(message, `<@${message.author.id}> probeerde de rol '**${roleGuild.name}**' aan zichzelf toe te kennen.`, '#4d88ff');
                })

            }
        } else {
            message.channel.send(`<@${message.author.id}> De rol '**${args[0]}**' bestaat niet. Check op typfouten of probeer het nog een keer.`);
        }
    }
}


function sendToLogChannel(message, msg, color) {
    const channel = message.channel.guild.channels.cache.find(channel => channel.name === 'log-karen');

    const client = message.channel.guild.members.cache.find(user => user.id === '755114060546310264');

    if (channel) {
        const msgEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle('Assistent Karen')
            .setURL('https://github.com/jpmsen/assistent-bot')
            .setAuthor('by KnifeKillah#7470', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/26/269e0405d072bc194ac3697b73bba9fea84fbe51_full.jpg')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`An assistent (bot, but do **not** tell her) that includes Quality of Life updates created with love for a specific server <3`)
            .addField('Status Bot', `${msg}`)
            .setFooter('Assistent Karen | Version 1.0.0')
            .setTimestamp();
        channel.send(msgEmbed);
    }
}