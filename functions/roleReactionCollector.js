const Keyv = require('keyv');
const { version, database } = require('../config.json');
const keyvRoles = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'roles' });
const keyvRoleEmbedMessages = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'roleEmbedMessages' });
const Discord = require('discord.js');
const emojis = require('../emojis/unicodeEmojis.js');

module.exports = {
    async setReactionCollector(msg) {
        // Only react when these emojis have been pressed
        const filter = (reaction, user) => {
            return [emojis[1], emojis[2], emojis[3], emojis[4], emojis[5], emojis[6], emojis[7], emojis[8], emojis[9]].includes(reaction.emoji.name) && user.id !== msg.author.id;
        };

        // create a reaction collector
        const collector = msg.createReactionCollector(filter, { dispose: true });

        // collectors event listeners.
        collector.on('collect', (reaction, user) => {
            manageUserRole(msg, reaction, user, 'collect');
        });

        collector.on('remove', (reaction, user) => {
            manageUserRole(msg, reaction, user, 'remove');
        });
    },
}


async function manageUserRole(msg, reaction, user, action) {
    const roleEmbedMessages = await keyvRoleEmbedMessages.get(msg.guild.id);
    const roles = await keyvRoles.get(msg.guild.id);

    // When users are not cached into the guild yet, find them using a fetch statement.
    await msg.guild.members.fetch(user.id).then(nonCachedUser => user = nonCachedUser);

    roleEmbedMessages.forEach((embedMsg, index) => {
        if (embedMsg === msg.id) {
            for (i = 0; i < 10; i++) {
                if (reaction.emoji.name === emojis[i]) {
                    // We multiply the index of current embed message by 9 to search for the role in the roles array.
                    const roleGuild = msg.guild.roles.cache.get(roles[i + index * 9 - 1]);

                    const roleObject = msg.guild.members.cache.get(user.id).roles;
                    const roleUser = roleObject.cache.get(roles[i + index * 9 - 1]);

                    if (action === 'collect') {
                        roleObject.add(roleGuild);
                    } else if (action === 'remove') {
                        roleObject.remove(roleGuild);
                    }
                }
            }
        }
    });
}