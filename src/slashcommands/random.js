const numOfYears = 4; // Do not go further than the creation of discord (untested)
const DISCORD_EPOCH = 1420070400000;
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { shift } = require('../utils/snowflakeUtil');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Grab a random memory from any user')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Random memory from a specific channel')),
    async execute(interaction) {
        let messages = interaction.channel.messages;
        const channel = interaction.options.get('channel');

        if (channel !== null) {
            if (channel.channel.type !== 'GUILD_TEXT') {
                return await interaction.reply({ content: "Channel must be a text channel!", ephemeral: true });
            }
            messages = channel.channel.messages;
        }


        /* Here we are trying to make an artifical discord snowflake.
        * (timestamp_ms - DISCORD_EPOCH) << 22 (timestamp to snowflake)
        * Since we are trying to create a random variation of a snowflake, we need an upper and lower bound on what we can timestamp
        * We take the discord epoch plus the number of years as the smallest timestamp we can go to (Ex. DiscordEpoch + 3years = 2018 at least)
        * Taking the current time - discord epoch gives us the proper time frame to represent todays date
        * Throwing these two values into a random generator between the two values gives us a random timestamp to look for a message
        * Bit shifting this to the right 22 times gives us an artifical snowflake that only has a proper timestamp
        /* For deeper information on snowflakes: https://discord.com/developers/docs/reference#snowflakes */
        let min = interaction.createdTimestamp - (DISCORD_EPOCH + (31556926000 * numOfYears)); 
        let today = interaction.createdTimestamp - DISCORD_EPOCH; // Start of today
        let rand = Math.floor(Math.random() * (today - min) + min);
        
        let randomDate = shift(rand, 22);
        
        try {
            const collectionOfMessages = await messages.fetch({ limit: 10, after: randomDate });
            const embed = new MessageEmbed().setTitle("Check this out").setURL(collectionOfMessages.random().url);
            await interaction.reply({ embeds: [embed] });
        } catch(err) {
            if (err.code == 50001) {
                return await interaction.reply({ content: "I seem to be missing access to view that, try to readd me to the server!", ephemeral: true });
            }
            console.error(`No message found for ${interaction.user.tag}.\n`, err);
            await interaction.reply({ content: "Can't find a memory ;(", ephemeral: true });
        }
        // Log for error related problems
        console.log(`Random memory by user ${interaction.user.username} (${interaction.user.id}) in channel (${interaction.channel.id}) in server ${interaction.guild} (${interaction.guild.id}) with ${interaction.guild.memberCount} users`);
    },
};