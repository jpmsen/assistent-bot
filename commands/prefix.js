const Keyv = require('keyv');
const { database } = require('../config.json');
const keyvPrefixes = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'prefixes' });


module.exports = {
    name: 'prefix',
    description: 'This command handles prefix command',
    args: true,
    usage: '<new prefix>',
    cooldown: 6000,
    async execute(message, args) {
        if (args.length) {
            await keyvPrefixes.set(message.guild.id, args[0]);
            return message.channel.send(`De prefix is veranderd naar: \`${args[0]}\``);
        }
    }
}