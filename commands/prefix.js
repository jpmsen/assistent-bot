const Keyv = require('keyv');
const { database } = require('../config.json');
const keyvPrefixes = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'prefixes' });
const keyvAdminRole = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'adminRoles' });

module.exports = {
    name: 'prefix',
    description: 'This command handles prefix command',
    args: true,
    usage: '<new prefix>',
    cooldown: 10,
    async execute(message, args) {
        if (args.length) {
            const modRole = await keyvAdminRole.get(message.guild.id);

            // only mod-role permissions allowed for this command.
            if (!message.member.roles.cache.find(role => role.id === modRole.replace('<', '').replace('@', '').replace('&', '').replace('>', ''))) {
                return message.reply(`Je hebt geen permissies om dit commando uit te voeren of de beheerder heeft nog geen mod-role ingesteld.`);
            }


            await keyvPrefixes.set(message.guild.id, args[0]);
            return message.channel.send(`De prefix is veranderd naar: \`${args[0]}\``);
        }
    }
}