const { prefix } = require('../config.json');
const { messageEmbed, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List of all commands',
    aliases: ['commands'],
    execute(message, args) {
        const helpEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor('Help Menu', 'https://cdn.discordapp.com/avatars/867469054931501078/bf64ca402609e37b2db3f9395a652abd.webp', 'https://github.com/lennysgarage/DiscordMemories')
        .setThumbnail('https://cdn.discordapp.com/avatars/867469054931501078/bf64ca402609e37b2db3f9395a652abd.webp')
        .addFields(
            { name: 'Memory Command', value: '\u200b' },
            { name: '```memory [channel|ID] [date|numOfYears]```', value: '- Showcases a memory from any user' },
            { name: '```memory```', value: '- Showcases a memory from a year ago' },
            { name: '```memory general```', value: '- Showcases a memory from the general channel a year ago' },
            { name: '```memory general 2019-05-05```', value: '- Showcases a memory from general around May 5th, 2019' },
            { name: '```memory general 3.14159```', value: '- Showcases a memory from general ~pi years ago' },
            { name: '\u200b', value: '\u200B' },
            { name: 'Random Command', value: '\u200b'},
            { name: '```random [channel|ID]```', value: '- Showcases a random memory from any user' },
            { name: '```random```', value: '- Showcases a random memory' },
            { name: '```random general```', value: '- Showcases a random memory from general' },
        )
        .setTimestamp()
        .setFooter('Prefix: ==', 'https://cdn.discordapp.com/avatars/867469054931501078/bf64ca402609e37b2db3f9395a652abd.webp');
            
        message.channel.send({ embeds: [helpEmbed] });
    }
}