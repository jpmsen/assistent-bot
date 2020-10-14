const Keyv = require('keyv');
const role = require('./role');
const keyvRoles = new Keyv('mongodb://user@127.0.0.1:27017/assistent-bot', { namespace: 'roles' });


module.exports = {
    name: 'config',
    description: 'This command handles all configuration commands',
    args: true,
    usage: '<config command> <arguments>',
    async execute(message, args) {
        if (args.length) {

            // $role command configurations
            if (args[0] === 'role') {

                // setting roles (this resets whole array)
                if (args[1] === 'set') {
                    const roles = [];
                    args.forEach((element, index) => {
                        if (index <= 1) return;

                        if (message.guild.roles.cache.find(role => role.id === element.replace('<', '').replace('@', '').replace('&', '').replace('>', ''))) {
                            roles.push(element);
                        }
                    });

                    await keyvRoles.set(message.guild.id, roles);
                }

                // adding new roles to the config without setting them
                if (args[1] === 'add') {
                    const roles = await keyvRoles.get(message.guild.id);

                    args.forEach((element, index) => {
                        if (index <= 1) return;

                        if (roles.find(existingRole => existingRole === element)) return;

                        if (message.guild.roles.cache.find(role => role.id === element.replace('<', '').replace('@', '').replace('&', '').replace('>', ''))) {
                            roles.push(element);
                        }

                        await keyvRoles.set(message.guild.id, roles);
                    })
                }

                // removing existing roles
                if (args[1] === 'remove') {
                    const roles = await keyvRoles.get(message.guild.id);

                    args.forEach((element, index) => {
                        if (index <= 1) return;

                        if (roles.find(existingRole => existingRole === element)) {
                            roles.splice(roles.indexOf(element), 1);
                            return;
                        }
                    });

                    await keyvRoles.set(message.guild.id, roles);
                }

                // getting roles
                if (args[1] === 'get') {
                    const roles = await keyvRoles.get(message.guild.id);

                    message.channel.send(`De huidige self-assignable rollen zijn: ${roles}`);
                }
            }

            // Enter here new configurations

        }
    }
}