const { SlashCommandBuilder } = require('@discordjs/builders');
const { prefix, inviteLink, voteLink, supportServer } = require('../config.json');
const pkg = require('../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Info on bot'),
    async execute(interaction) {
        // Grab total member count
        await interaction.client.guilds.fetch();
        let memberCount = 0;
        for (const guild of interaction.client.guilds.cache.values()) {
            memberCount += guild.memberCount;
        }

        let infoEmbed = {
            color: '#0099ff',
            title: 'Information:',
            thumbnail: {
                url: interaction.client.user.avatarURL(),
            },
            fields: [
                {
                    name: '❯ Info:',
                    value: `
• Name: <@${interaction.client.user.id}> \`(${interaction.client.user.tag})\` 
• ID: \`${interaction.client.user.id}\`
• Creation Date: \`${interaction.client.user.createdAt}\`
• Prefix: \`${prefix}\`
• Discord.js: \`${pkg.dependencies['discord.js']}\`
• Node: \`${process.version}\` 
                    `,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                },
                {
                    name: '❯ Bot:',
                    value: `
• Bot Latency: \`${Date.now() - interaction.createdTimestamp} ms\`
• Uptime: \`${new Date(process.uptime() * 1000).toISOString().substr(11, 8)}\`
• Ram: \`${(process.memoryUsage.rss() * 0.000001).toFixed(2)} MB\`
• Version: \`${pkg.version}\`
                    `,
                    inline: true,
                },
                {
                    name: '❯ Analytics:',
                    value: `
• Users: \`Loading...\`
• Channels: \`Loading...\`
• Servers: \`Loading...\`
                    `,
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                },
                {
                    name: '❯ Other:',
                    value: `
• Developer: <@108038507708141568> lennysgarage#2361
• Invite: [Click Here](${inviteLink})
• Vote: [Click Here](${voteLink})
• Support Server: [Click Here](${supportServer})
                    `
                }
            ],
        };

        try {
            await interaction.reply({ embeds: [infoEmbed] });
        } catch (err) {
            console.log("Failed to send embed", err)
        }

        // Update embed with Analytics information.
        infoEmbed = {
            color: '#0099ff',
            title: 'Information:',
            thumbnail: {
                url: interaction.client.user.avatarURL(),
            },
            fields: [
                {
                    name: '❯ Info:',
                    value: `
• Name: <@${interaction.client.user.id}> \`(${interaction.client.user.tag})\` 
• ID: \`${interaction.client.user.id}\`
• Creation Date: \`${interaction.client.user.createdAt}\`
• Prefix: \`${prefix}\`
• Discord.js: \`${pkg.dependencies['discord.js']}\`
• Node: \`${process.version}\` 
                    `,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                },
                {
                    name: '❯ Bot:',
                    value: `
• Bot Latency: \`${Date.now() - interaction.createdTimestamp} ms\`
• Uptime: \`${new Date(process.uptime() * 1000).toISOString().substr(11, 8)}\`
• Ram: \`${(process.memoryUsage.rss() * 0.000001).toFixed(2)} MB\`
• Version: \`${pkg.version}\`
                    `,
                    inline: true,
                },
                {
                    name: '❯ Analytics:',
                    value: `
• Users: \`${memberCount}\`
• Channels: \`${interaction.client.channels.cache.size}\`
• Servers: \`${interaction.client.guilds.cache.size}\`
                    `,
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                },
                {
                    name: '❯ Other:',
                    value: `
• Developer: <@108038507708141568> lennysgarage#2361
• Invite: [Click Here](${inviteLink})
• Vote: [Click Here](${voteLink})
• Support Server: [Click Here](${supportServer})
                    `
                }
            ],
        };
        try {
            await interaction.editReply({ embeds: [infoEmbed] });
        } catch (err) {
            console.log("Failed to update reply", err)
        }
    },
};