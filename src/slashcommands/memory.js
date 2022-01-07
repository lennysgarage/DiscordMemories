const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('memory')
        .setDescription('Grab a memory from the past'),
    async execute(interaction) {
        await interaction.reply("placeholder");
    },
};