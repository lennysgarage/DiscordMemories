
module.exports = {
    name: 'guildDelete',
    async execute(guild) {
        console.log(`I have been removed from: ${guild.name} (id: ${guild.id}). This guild had ${guild.memberCount} members!`);
    },
};