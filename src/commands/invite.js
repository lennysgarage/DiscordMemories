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
        .setAuthor('Invite Bot', 'https://cdn.discordapp.com/avatars/867469054931501078/bf64ca402609e37b2db3f9395a652abd.webp', inviteLink)
        .addFields(
            { name: 'Click Below', value: `[Invite Me!](${inviteLink})` })
        .setTimestamp()
        .setFooter(`Prefix: ${prefix}`);

        return await message.channel.send({ embeds: [inviteEmbed] });
    }
}