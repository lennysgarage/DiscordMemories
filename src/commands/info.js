const { prefix, inviteLink, voteLink, supportServer } = require('../config.json');
const pkg = require('../../package.json');

module.exports = {
    name: 'info',
    description: 'Info on bot',
    usage: [''],
    usage_desc: ['Info/stats on bot'],
    async execute(message, args) {
        // Grab total member count
        await message.client.guilds.fetch();
        let memberCount = 0;
        for (const guild of message.client.guilds.cache.values()) {
            memberCount += guild.memberCount;
        }


        const infoEmbed = {
            color: '#0099ff',
            title: 'Information:',
            thumbnail: {
                url: message.client.user.avatarURL(),
            },
            fields: [
                {
                    name: '❯ Info:',
                    value: `
• Name: <@${message.client.user.id}> \`(${message.client.user.tag})\` 
• ID: \`${message.client.user.id}\`
• Creation Date: \`${message.client.user.createdAt}\`
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
• Bot Latency: \`${Date.now() - message.createdTimestamp} ms\`
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
• Channels: \`${message.client.channels.cache.size}\`
• Servers: \`${message.client.guilds.cache.size}\`
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


        await message.channel.send({ embeds: [infoEmbed] });
    }
}