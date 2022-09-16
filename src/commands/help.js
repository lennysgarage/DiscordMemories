const { prefix, inviteLink, voteLink, supportServer } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List of all commands',
    usage: ['[command]', '', 'memory', 'random'],
    usage_desc: ['- Brings up the help menu', '- Brings up the main help menu', '- Brings up the help menu for memory', '- Brings up the help menu for random'],
    async execute(message, args) {
        const { commands } = message.client;

        if (!args.length) {
            const helpEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setAuthor({ name: 'Help Menu', iconURL: message.client.user.avatarURL(), url: 'https://github.com/lennysgarage/DiscordMemories' })
                .setThumbnail(message.client.user.avatarURL())
                .addFields(
                    { name: 'Prefix: ```==```', value: `[Invite Me!](${inviteLink}) | [Vote Here!](${voteLink}) | [Support Server](${supportServer})` },
                    { name: 'Memory Command', value: '\u200b' },
                    { name: '```memory [channel|ID] [date|numOfYears]```', value: '- Showcases a memory from any user' },
                    { name: '```memory```', value: '- Showcases a memory from a year ago' },
                    { name: '```memory general```', value: '- Showcases a memory from the general channel a year ago' },
                    { name: '```memory general 2019-05-05```', value: '- Showcases a memory from general around May 5th, 2019' },
                    { name: '```memory general 3.14159```', value: '- Showcases a memory from general ~pi years ago' },
                    { name: '\u200b', value: '\u200B' },
                    { name: 'Random Command', value: '\u200b' },
                    { name: '```random [channel|ID] [startDate|minNumOfYears] [endDate|maxNumOfYears]```', value: '- Showcases a random memory from any user' },
                    { name: '```random```', value: '- Showcases a random memory' },
                    { name: '```random general```', value: '- Showcases a random memory from general' },
                    { name: '```random general Jan 1 2021 May 5 2022```', value: '- Showcases a random memory from general between Jan 1st, 2021 and May 5th, 2022' },
                    { name: '\u200b', value: '\u200B' },
                    { name: 'Invite bot', value: `${prefix}invite`, inline: true },
                    { name: 'Info/Stats', value: `${prefix}info`, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: `${prefix}help [command] to get info on a specific command`, iconURL: message.client.user.avatarURL() });

            return await message.channel.send({ embeds: [helpEmbed] });
        }


        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return await message.reply({ content: 'that\'s not a valid command!', allowedMentions: { repliedUser: false } });
        } else if (command) {
            const data = command.usage;
            const data_desc = command.usage_desc;
            const commandEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setAuthor({ name: `${command.name} Command`, iconURL: message.client.user.avatarURL(), url: 'https://github.com/lennysgarage/DiscordMemories' })
                .setTimestamp()
                .setFooter({ text: `Prefix: ${prefix}` });
            data.forEach((usage, i) => {
                commandEmbed.addFields({ name: ` \`${command.name} ${usage}\` `, value: data_desc[i] });
            });

            return await message.channel.send({ embeds: [commandEmbed] });;
        }
    }
}