const Keyv = require('keyv');
const emojis = require('../emojis/unicodeEmojis.js');
const roleReactionCollector = require('../functions/roleReactionCollector.js');
const { version, database } = require('../config.json');
const keyvRoles = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'roles' });
const keyvAdminRole = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'adminRoles' });
const keyvRoleEmbedMessages = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'roleEmbedMessages' });
const keyvRoleChannel = new Keyv(`${database.type}://${database.user}${database.password === "" ? '' : ':'}${database.password}@${database.connection}:${database.port}/${database.name}`, { namespace: 'roleChannel' });

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

                    // Put all roles into an array and save it to database
                    args.forEach((element, index) => {
                        if (index <= 1) return;

                        // Because only tags will work when setting roles, remove the tag characters from string
                        element = element.replace('<', '').replace('@', '').replace('&', '').replace('>', '');

                        if (message.guild.roles.cache.find(role => role.id === element)) {
                            roles.push(element);
                        }
                    });
                    keyvRoles.set(message.guild.id, roles);


                    // Get the channel where the embedded messages should be send
                    const roleChannelId = await keyvRoleChannel.get(message.guild.id);
                    const roleChannel = message.guild.channels.cache.get(roleChannelId);

                    // If the channel does not yet exist in the database, ask user to create one.
                    if (roleChannel == undefined) message.reply(`Voer eerst het commando \`config role channel <channel>\` uit.`);

                    // Delete last send embedded message if exists.
                    const existingEmbedMessages = await keyvRoleEmbedMessages.get(message.guild.id);
                    if (existingEmbedMessages !== undefined) {
                        existingEmbedMessages.forEach(msgId => {
                            roleChannel.messages.fetch(msgId).then(msg => {
                                try {
                                    msg.delete()
                                } catch { console.error("Couldn't delete older message (line 74)")}
                            });
                        })
                    }

                    // Reset the embed messages Array
                    const embedMessagesId = [];

                    /**
                     * Explanation for the code below:
                     * 1. Loop over every role and add it to an embedded message
                     * 2. When the items in the embedded message exceeds the maximum of 9, then another message will be created.
                     * 3. When a embedded message is send, get the id of that message and react the emojis required.
                     * 4. Create a reaction collector for this message so that we can track who pressed a certain emoji.
                     */
                    roles.forEach((element, index) => {
                        // Get the role
                        const guildRole = message.guild.roles.cache.get(element);

                        // Create an object and push that to the embedded message object.
                        const fieldObj = {
                            name: `> ${emojis[(index + 1) % 9 === 0 ? 9 : (index + 1) % 9]}`,
                            value: `${guildRole.name}`
                        }
                        embedObj.fields.push(fieldObj);

                        // If we have looped over 9 items in this array, send the message with the embedded object.
                        if ((index + 1) % 9 === 0) {
                            roleChannel.send({ embed: embedObj }).then(async msg => {
                                // Push the embedMessage id in the array so that we can delete this embedded message later.
                                embedMessagesId.push(msg.id);

                                // React with numbers 1 through 9.
                                try {
                                    for (i = 0; i < index + 1; i++) {
                                        await msg.react(`${emojis[i + 1]}`);
                                    }
                                } catch {}

                                // Create a reaction collector for this message.
                                roleReactionCollector.setReactionCollector(msg);
                                // setReactionCollector(msg);
                            });

                            // Reset the fields in the embedded message.
                            embedObj.fields = [];
                        }
                    });

                    // Send unfinished 9 item array.
                    roleChannel.send({ embed: embedObj }).then(msg => {
                        // Push the embedMessage id in the array so that we can delete this embedded message later.
                        embedMessagesId.push(msg.id);

                        // React the remaining numbers
                        embedObj.fields.forEach(async(element, index) => {
                                try {
                                    await msg.react(`${emojis[index + 1]}`)
                                } catch {}
                            })
                            // Create a reaction collector for this message.
                            roleReactionCollector.setReactionCollector(msg);
                        // setReactionCollector(msg);

                        embedObj.fields = [];
                        // Add all the embedded message ids to the database.
                        keyvRoleEmbedMessages.set(message.guild.id, embedMessagesId);
                    });
                }

                // getting roles
                if (args[1] === 'get') {
                    const roles = await keyvRoles.get(message.guild.id);

                    message.channel.send(`De huidige self-assignable rollen zijn: ${roles}`);
                }

                if (args[1] === 'channel') {
                    keyvRoleChannel.set(message.guild.id, args[2].replace('<', '').replace('#', '').replace('&', '').replace('>', ''));
                }
            }

            // Enter new configurations here

        }


        // methods

        /**
         * Creates a reaction listener.
         * @param {string} msg message object
         */
        async function setReactionCollector(msg) {
            // Only react when these emojis have been pressed
            const filter = (reaction, user) => {
                return [emojis[1], emojis[2], emojis[3], emojis[4], emojis[5], emojis[6], emojis[7], emojis[8], emojis[9]].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            // create a reaction collector
            const collector = msg.createReactionCollector(filter, { dispose: true });

            // collectors event listeners.
            collector.on('collect', async(reaction, user) => {
                manageUserRole(msg, reaction, user, 'collect');
            });

            collector.on('remove', async(reaction, user) => {
                manageUserRole(msg, reaction, user, 'remove');
            });
        }

        async function manageUserRole(msg, reaction, user, action) {
            const roleEmbedMessages = await keyvRoleEmbedMessages.get(msg.guild.id);
            const roles = await keyvRoles.get(msg.guild.id);

            roleEmbedMessages.forEach((embedMsg, index) => {
                if (embedMsg === msg.id) {
                    for (i = 0; i < 10; i++) {
                        if (reaction.emoji.name === emojis[i]) {
                            // We multiply the index of current embed message by 9 to search for the role in the roles array.
                            const roleGuild = msg.guild.roles.cache.get(roles[i + index * 9 - 1]);

                            const roleObject = msg.guild.members.cache.get(user.id).roles;
                            const roleUser = roleObject.cache.get(roles[i + index * 9 - 1]);

                            if (action === 'collect') {
                                roleObject.add(roleGuild);
                            } else if (action === 'remove') {
                                roleObject.remove(roleGuild);
                            }
                        }
                    }
                }
            });
        }
    }
}