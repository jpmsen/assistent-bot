module.exports = {
    name: 'clearchat',
    description: 'Clears the chat within the given limit parameter.',
    args: true,
    cooldown: 20,
    execute(message, args) {
        if (message.member.roles.cache.find(role => role.name.toLowerCase() === 'admin')) {

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

        }
    }
}