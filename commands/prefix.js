const Keyv = require('keyv');
const keyvPrefixes = new Keyv('mongodb://user@127.0.0.1:27017/assistent-bot', { namespace: 'prefixes' });


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