const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { shift } = require('../utils/snowflakeUtil');
const DISCORD_EPOCH = 1420070400000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('memory')
        .setDescription('Grab a memory from the past')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Memory from a specific channel'))
        .addStringOption(option =>
            option
                .setName('date')
                .setDescription('Memory from a specific time')),
    async execute(interaction) {
        let messages = interaction.channel.messages;
        const channel = interaction.options.get('channel');
        const time = interaction.options.get('date');
        
        if (channel !== null) {
            if (channel.channel.type !== 'GUILD_TEXT') {
                return await interaction.reply({ content: "Channel must be a text channel!", ephemeral: true });
            }
            messages = channel.channel.messages;
        }

        let numOfYears = 1; // Default behaviour
        /* Can specify when to find a memory from */
        /* Can enter a date or just how long ago */
        if (time !== null) {
            if (!isNaN(time.value)) numOfYears = parseFloat(time.value).toFixed(8);
            else numOfYears = ((interaction.createdTimestamp - (interaction.createdTimestamp % 86400000) - new Date(time.value).getTime())/31535900000).toFixed(8);
            // 8 Digits allow for better accuracy when dealing with miliseconds
            // We grab the current time subtracting the number of miliseconds currently in the day to get the earliest moment
            // We take this time divided by roughly how many miliseconds in a year
        }

        
        /* Here we are trying to make an artifical discord snowflake.
         * (timestamp_ms - DISCORD_EPOCH) << 22 (timestamp to snowflake)
         * Since we are trying to create a snowflake from possibly multiple years ago we use the biggest unit, a year
         * Leaving us with a general formula: (time at the start of message's day) - discordEpoch - # of years
         * Since discord time uses UTC, as a quick workaround for EST, we take the DISCORD_EPOCH subtracting 5hours
         * In the future, we can customize this by just subtracting or adding an hour * a variable with some input
         * Bit shifting this to the right 22 times gives us an artifical snowflake that only has a proper timestamp
        /* For deeper information on snowflakes: https://discord.com/developers/docs/reference#snowflakes */
        let dateAfter = shift((interaction.createdTimestamp - (interaction.createdTimestamp % 86400000) - (DISCORD_EPOCH - 18000000) - (31535900000 * numOfYears)), 22);
        let todayPlusOne = shift(interaction.createdTimestamp - (interaction.createdTimestamp % 86400000) + 86400000 - DISCORD_EPOCH, 22);
        if (numOfYears < 0 || dateAfter < 0 || dateAfter > todayPlusOne || isNaN(dateAfter) ) {
            return await interaction.reply({ content: "Invalid date", ephemeral: true });
        }


        try {
            const collectionOfMessages = await messages.fetch({ limit: 10, after: dateAfter });
            /* Here we check for the actual timestamp of the msg */
            const msgToSend = collectionOfMessages.random();
            const timeOfMsg = ((new Date().getTime() - msgToSend.createdTimestamp)/31535900000).toFixed(8);
            const responseMsg = (timeOfMsg > 1 || timeOfMsg < 1) ? `Hey checkout this memory from ${timeOfMsg} years ago!` : 
            "Hey checkout this memory from a year ago!";
            const embed = new MessageEmbed().setTitle(responseMsg).setURL(msgToSend.url);
            await interaction.reply({ embeds: [embed] });
        } catch(err) {
            if (err.code == 50001) {
                return await interaction.reply({ content: "I seem to be missing access to view that, try to readd me to the server!", ephemeral: true });
            }
            console.error(`No message found for ${interaction.user.tag}.\n`, err);
            await interaction.reply({ content: "Can't find a memory ;(", ephemeral: true });
        }
        // Log for error related problems
        console.log(`Memory from ${numOfYears} years ago by user ${interaction.user.username} (${interaction.user.id}) in channel (${interaction.channel.id}) in server ${interaction.guild} (${interaction.guild.id}) with ${interaction.guild.memberCount} users`);
    },
};


