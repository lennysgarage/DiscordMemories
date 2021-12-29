const { prefix } = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setActivity(`${prefix}help`, { type: 'WATCHING' });
        console.log(`Starting to service ${client.guilds.cache.size} guilds`);
        console.log('Ready!');
    },
};