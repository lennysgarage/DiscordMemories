
module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    },
};