const Keyv = require('keyv');
const numWords = require('num-words');
const emojis = require('../emojis/unicodeEmojis.js');
const { version, database } = require('../config.json');
const keyvRoles = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'roles' });
const keyvAdminRole = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'adminRoles' });
const keyvRoleEmbedMessages = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'roleEmbedMessages' });


const embedObj = {
    color: '#fffff',
    title: 'Assistent Karen',
    url: 'https://github.com/jpmsen/assistent-bot',
    author: {
        name: 'by KnifeKillah#7470',
        icon_url: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/26/269e0405d072bc194ac3697b73bba9fea84fbe51_full.jpg',
    },
    description: `\`Reageer op de rol(len) die jij wilt hebben in de lijst hieronder\``,
    fields: [],
    footer: {
        text: `Assistent Karen | Version ${version}`,
    },
    timestamp: new Date(),
};

module.exports = {
    name: 'config',
    description: 'This command handles all configuration commands',
    args: true,
    usage: '<config command> <arguments>',
    async execute(message, args) {
        if (args.length) {
            const modRole = await keyvAdminRole.get(message.guild.id);

            // only mod-role permissions allowed for this command.
            if (!message.member.roles.cache.find(role => role.id === modRole.replace('<', '').replace('@', '').replace('&', '').replace('>', ''))) {
                return message.reply(`Je hebt geen permissies om dit commando uit te voeren of de beheerder heeft nog geen mod-role ingesteld.`);
            }

            // $role command configurations (crud)
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

                    keyvRoles.set(message.guild.id, roles);
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

                        keyvRoles.set(message.guild.id, roles);
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

                    keyvRoles.set(message.guild.id, roles);
                }

                // getting roles
                if (args[1] === 'get') {
                    const roles = await keyvRoles.get(message.guild.id);

                    message.channel.send(`De huidige self-assignable rollen zijn: ${roles}`);
                }

                if (args[1] === 'test') {
                    const roles = await keyvRoles.get(message.guild.id);
                    let arrayDimension = 0;
                    const embedMessagesId = [];

                    roles.forEach((element, index) => {
                        element = element.replace('<', '').replace('@', '').replace('&', '').replace('>', '');
                        const guildRole = message.guild.roles.cache.find(role => role.id === element);
                        const fieldObj = {
                            name: `> ${emojis[(index + 1) % 9 === 0 ? 9 : (index + 1) % 9]}`,
                            value: `${guildRole.name}`
                        }
                        embedObj.fields.push(fieldObj);

                        if ((index + 1) % 9 === 0) {
                            message.channel.send({ embed: embedObj }).then(async msg => {
                                setReactionCollector(msg, arrayDimension);
                                arrayDimension += 1;
                                embedMessagesId.push(msg.id);
                                try {
                                    for (i = 0; i < index + 1; i++) {
                                        await msg.react(`${emojis[i + 1]}`);
                                    }
                                } catch {

                                }
                            });
                            embedObj.fields = [];
                        }
                    });

                    // Send unfinished 9 item array. Save message ids.
                    message.channel.send({ embed: embedObj }).then(msg => {
                        embedMessagesId.push(msg.id);
                        embedObj.fields.forEach(async(element, index) => {
                            try {
                                await msg.react(`${emojis[index + 1]}`)
                            } catch {}
                        })
                        keyvRoleEmbedMessages.set(message.guild.id, embedMessagesId);
                        setReactionCollector(msg, arrayDimension);
                    })
                }

                if(args[2] === 'test2') {

                }

            }

            // Enter here new configurations

        }
        async function setReactionCollector(msg, dimension) {
            const filter = (reaction, user) => {
                return [emojis[1], emojis[2], emojis[3], emojis[4], emojis[5], emojis[6], emojis[7], emojis[8], emojis[9]].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            const collector = msg.createReactionCollector(filter, { dispose: true });

            collector.on('collect', async (reaction, user) => {
                const roleEmbedMessages = await keyvRoleEmbedMessages.get(msg.guild.id);
            const roles = await keyvRoles.get(msg.guild.id);

                roleEmbedMessages.forEach((embedMsg, index) => {
                    if(embedMsg === msg.id) {
                        for(i = 0; i < 10; i ++) {
                            if(reaction.emoji.name === emojis[i]) {
                                // We multiply the index of current embed message by 9 to search for the role in the roles array.
                                const userMember = msg.guild.members.cache.find(member => member.id === user.id);
                                const roleGuild = msg.guild.roles.cache.find(role => role.id === roles[i + index * 9 - 1].replace('<', '').replace('@', '').replace('&', '').replace('>', ''));
                                const roleUser = userMember.roles.cache.find(role => role.id === roles[i + index * 9 - 1].replace('<', '').replace('@', '').replace('&', '').replace('>', ''));
                                    message.member.roles.add(roleGuild);
                            }
                        }
                    }
                });
            });

            collector.on('remove', async (reaction, user) => {
                const roleEmbedMessages = await keyvRoleEmbedMessages.get(msg.guild.id);
                const roles = await keyvRoles.get(msg.guild.id);


                roleEmbedMessages.forEach((embedMsg, index) => {
                    if(embedMsg === msg.id) {
                        for(i = 0; i < 10; i ++) {
                            if(reaction.emoji.name === emojis[i]) {
                                // We multiply the index of current embed message by 9 to search for the role in the roles array.
                                const userMember = msg.guild.members.cache.find(member => member.id === user.id);
                                const roleGuild = msg.guild.roles.cache.find(role => role.id === roles[i + index * 9 - 1].replace('<', '').replace('@', '').replace('&', '').replace('>', ''));
                                const roleUser = userMember.roles.cache.find(role => role.id === roles[i + index * 9 - 1].replace('<', '').replace('@', '').replace('&', '').replace('>', ''));
                                    message.member.roles.remove(roleGuild);
                            }
                        }
                    }
                });
            });
        }
    }
}