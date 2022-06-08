const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const { prefix, inviteLink } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invite link for Memories Bot!'),
    async execute(interaction) {
        const inviteEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor('Invite Bot', interaction.client.user.avatarURL(), inviteLink)
        .addFields(
            { name: 'Click Below', value: `[Invite Me!](${inviteLink})` })
        .setTimestamp()
        .setFooter(`Prefix: ${prefix}`);

        return await interaction.reply({ embeds: [inviteEmbed] });
    },
};