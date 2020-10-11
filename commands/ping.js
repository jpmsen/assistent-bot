module.exports = {
    name: 'ping',
    description: 'Ping!',
    args: true,
    execute(message, args) {
        if (args[0] === 'pong') {
            message.channel.send('Ping!');
        } else {
            message.channel.send('Pong!');
        }
    }
}