const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List all commands or information about a specific command.',
    aliases: ['commands'],
    usage: '<command name>',
    execute(message, args) {
        const data = [];

        const { commands } = message.client;

        if (!args.length) {
            data.push('Hier is een lijst met alle beschikbare commands:');
            data.push(commands.map(command => command.name).join(', '));

            return message.channel.send(data, { split: true }).catch(error => {
                console.error(error);
            });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('Dit command bestaat niet.');
        }

        data.push(`**Naam:** ${command.name}`);

        if (command.aliases) {
            data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        }

        if (command.description) {
            data.push(`**Beschrijving:** ${command.description}`);
        }

        if (command.usage) {
            data.push(`**Gebruik:** ${prefix}${command.name} ${command.usage}`);
        }

        data.push(`**Cooldown:** ${command.cooldown || 3} seconde(s)`)

        message.channel.send(data, { split: true });
    }
}