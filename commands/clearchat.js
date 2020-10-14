// TODO: https://github.com/discordjs/guide/blob/master/code-samples/command-handling/adding-features/12/commands/prune.js
const { database } = require('../config.json');
const Keyv = require('keyv');
const keyvAdminRole = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'adminRoles' });

module.exports = {
    name: 'clearchat',
    description: 'Clears the chat within the given limit parameter.',
    args: true,
    usage: '<amount>',
    cooldown: 20,
    async execute(message, args) {
        const modRole = await keyvAdminRole.get(message.guild.id);

        // Check permissions for modrole.
        if (message.member.roles.cache.find(role => role.id === modRole.replace('<', '').replace('@', '').replace('&', '').replace('>', ''))) {

            const arrayPromise = new Promise((resolve, reject) => {
                message.channel.messages.fetch({ limit: `${args[0]}` }).then(messages => {
                    messages.forEach((value, index, arr) => {
                        message.channel.messages.delete(value);
                    });
                    resolve();
                })
            });

            arrayPromise.then(() => {
                message.channel.send(`Cleared **${args[0]}** messages in this channel!`);
            })

        } else {
            message.reply(`Je hebt geen permissies om dit commando uit te voeren of de beheerder heeft nog geen mod-role ingesteld.`);
        }
    }
}