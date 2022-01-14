
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        const client = interaction.client;

        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;
        
        try {
            await command.execute(interaction);
        } catch(error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to run that interaction!', ephemeral: true });
        }
    },
};