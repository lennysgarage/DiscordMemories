const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { prefix, inviteLink, voteLink, supportServer } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List of all commands')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('Bring up the help menu for the command')
                .addChoices([
                    ['Memory', 'memory'],
                    ['Random', 'random'],
                    ['Help', 'help'],
                    ['Info', 'info'],
                    ['Invite', 'invite']
                ])),
    async execute(interaction) {
        const cmd = interaction.options.get('command');

        if (!cmd) {
            const helpEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor('Help Menu', interaction.client.user.avatarURL(), 'https://github.com/lennysgarage/DiscordMemories')
            .setThumbnail(interaction.client.user.avatarURL())
            .addFields(
                { name: 'Prefix: ```==```', value:`[Invite Me!](${inviteLink}) | [Vote Here!](${voteLink}) | [Support Server](${supportServer})`},
                { name: 'Memory Command', value: '\u200b' },
                { name: '```memory [channel|ID] [date|numOfYears]```', value: '- Showcases a memory from any user' },
                { name: '```memory```', value: '- Showcases a memory from a year ago' },
                { name: '```memory general```', value: '- Showcases a memory from the general channel a year ago' },
                { name: '```memory general 2019-05-05```', value: '- Showcases a memory from general around May 5th, 2019' },
                { name: '```memory general 3.14159```', value: '- Showcases a memory from general ~pi years ago' },
                { name: '\u200b', value: '\u200B' },
                { name: 'Random Command', value: '\u200b'},
                { name: '```random [channel|ID]```', value: '- Showcases a random memory from any user' },
                { name: '```random```', value: '- Showcases a random memory' },
                { name: '```random general```', value: '- Showcases a random memory from general' },
                { name: '\u200b', value: '\u200B' },
                { name: 'Invite bot', value: `${prefix}invite`, inline: true },
                { name: 'Info/Stats', value: `${prefix}info`, inline: true },
            )
            .setTimestamp()
            .setFooter(`${prefix}help [command] to get info on a specific command`, interaction.client.user.avatarURL());
                
            return await interaction.reply({ embeds: [helpEmbed] });
        }

        // This uses the old messageCreate event's commands to get their usage
        const command = interaction.client.commands.get(cmd.value);
        const data = command.usage;
        const data_desc = command.usage_desc;
        const commandEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(`${command.name} Command`, interaction.client.user.avatarURL(), 'https://github.com/lennysgarage/DiscordMemories')
            .setTimestamp()
            .setFooter(`Prefix: ${prefix}`);
        data.forEach((usage, i) => {
            commandEmbed.addField(` \`${command.name} ${usage}\` `, data_desc[i]);
            });
        
        return await interaction.reply({ embeds: [commandEmbed] });;
    },
};