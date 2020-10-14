const Discord = require('discord.js')
const Keyv = require('keyv');
const { database } = require('../config.json');
const keyvRoles = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'roles' });

module.exports = {
    name: 'role',
    description: 'Adds or removes a role to a user profile.',
    args: true,
    usage: '<rol>',
    cooldown: 3,
    async execute(message, args) {
        const allowedRoles = await keyvRoles.get(message.guild.id);

        args.forEach(element => {
            // Find the role on the guild using the id or when a partial name is used (so @mentions or just strings are allowed).
            const roleGuild = message.guild.roles.cache.find(role => role.id === element.replace('<', '').replace('@', '').replace('&', '').replace('>', '') || role.name.toLowerCase().startsWith(args[0].toLowerCase()));

            // If a role exists on the guild, then continue adding/removing role to user. Else say that this role can not be managed.
            if (allowedRoles.find(existingRole => existingRole === element) || roleGuild.id === element) {

                const roleUser = message.member.roles.cache.find(role => role.id === element.replace('<', '').replace('@', '').replace('&', '').replace('>', '') || role.name.toLowerCase().startsWith(args[0].toLowerCase()));
                // if the role is found on user, delete it. Else add role to user.
                if (roleUser) {
                    message.member.roles.remove(roleGuild);
                } else {
                    message.member.roles.add(roleGuild);
                }
            } else {
                message.reply(`We konden \` ${args[0]} \` niet vinden op deze server. Het kan ook zijn dat het niet toegestaan is om jezelf deze rol te geven.`)
            }
        });
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