const Keyv = require('keyv');
const { database } = require('../config.json');
const keyvAdminRole = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'adminRoles' });

module.exports = {
    name: 'mod',
    description: 'This command handles admin role. This is required for some commands when using this bot.',
    args: true,
    usage: '<new mod role>',
    cooldown: 10,
    async execute(message, args) {


        let modRole = await keyvAdminRole.get(message.guild.id);

        if (!message.member.roles.cache.some(role => role.id === modRole.replace('<', '').replace('@', '').replace('&', '').replace('>', ''))) return message.reply(`Je hebt geen permissie om de mod role aan te passen. Helaas pindakaas!`);

        if (args.length) {
            if (message.guild.roles.cache.find(role => role.id === args[0].replace('<', '').replace('@', '').replace('&', '').replace('>', ''))) {
                await keyvAdminRole.set(message.guild.id, args[0])
                return message.channel.send(`De mod-role is veranderd naar: ${args[0]}`);
            } else {
                return message.channel.send(`${args[0]} wordt niet herkend op je server. Probeer de rol aan te wijzen door middel van een tag.`);
            }
        }
    }
}