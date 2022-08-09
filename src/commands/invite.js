const { MessageEmbed } = require("discord.js");
const { prefix, inviteLink } = require('../config.json');

module.exports = {
    name: 'invite',
    description: 'Invite link for Memories Bot!',
    usage: [''],
    usage_desc: ['Invite link for bot!'],
    async execute(message, args) {
        const inviteEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor({ name: 'Invite Bot', iconURL: message.client.user.avatarURL(), name: inviteLink })
            .addFields(
                { name: 'Click Below', value: `[Invite Me!](${inviteLink})` })
            .setTimestamp()
            .setFooter({ text: `Prefix: ${prefix}` });

        return await message.channel.send({ embeds: [inviteEmbed] });
    },
};