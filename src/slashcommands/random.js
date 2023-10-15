const DISCORD_EPOCH = 1420070400000;
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Collection } = require('discord.js');
const { shift } = require('../utils/snowflakeUtil');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Grab a random memory from any user')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Random memory from a specific channel'))
    .addUserOption(option => 
        option
            .setName('user')
            .setDescription('User to find a message from'))
        .addStringOption(option =>
            option
                .setName('startdate')
                .setDescription('Start date to search from'))
        .addStringOption(option =>
            option
                .setName('enddate')
                .setDescription('End date to search to')),
    async execute(interaction) {
        let messages = interaction.channel.messages;
        const channel = interaction.options.get('channel');
        const startDate = interaction.options.get('startdate');
        const endDate = interaction.options.get('enddate');
        let maxNumOfYears = ((interaction.createdTimestamp - interaction.channel.createdTimestamp) / 31535900000).toFixed(8);

        let user = interaction.options.get('user');

        if (channel !== null) {
            if (channel.channel.type !== 'GUILD_TEXT' && channel.channel.type !== 'GUILD_CATEGORY') {
                return await interaction.reply({ content: "Channel must be a text channel!", ephemeral: true });
            }
            let chn = channel.channel;
            if (channel.channel.type !== 'GUILD_TEXT') {
                await interaction.client.guilds.fetch();
                chn = channel.channel.children.random();
            }
            messages = chn.messages;
            maxNumOfYears = ((interaction.createdTimestamp - chn.createdTimestamp) / 31535900000).toFixed(8);
        }

        let startNumOfYears = 0; // Default behaviour
        let endNumOfYears = maxNumOfYears; // set maximum to date of channel creation
        /* Can specify when to find a memory from */
        /* Can enter a date or just how long ago */
        if (startDate !== null) {
            if (!isNaN(startDate.value)) startNumOfYears = parseFloat(startDate.value).toFixed(8);
            else startNumOfYears = ((interaction.createdTimestamp - (interaction.createdTimestamp % 86400000) - new Date(startDate.value).getTime()) / 31535900000).toFixed(8);
            // 8 Digits allow for better accuracy when dealing with miliseconds
            // We grab the current time subtracting the number of miliseconds currently in the day to get the earliest moment
            // We take this time divided by roughly how many miliseconds in a year
        }
        if (endDate !== null) {
            if (!isNaN(endDate.value)) endNumOfYears = parseFloat(endDate.value).toFixed(8);
            else endNumOfYears = ((interaction.createdTimestamp - (interaction.createdTimestamp % 86400000) - new Date(endDate.value).getTime()) / 31535900000).toFixed(8);
            // 8 Digits allow for better accuracy when dealing with miliseconds
            // We grab the current time subtracting the number of miliseconds currently in the day to get the earliest moment
            // We take this time divided by roughly how many miliseconds in a year
        }


        if (startNumOfYears < 0 || endNumOfYears < 0 || isNaN(startNumOfYears) || isNaN(endNumOfYears)) {
            return await interaction.reply({ content: "Invalid date", ephemeral: true })
        }

        // Cannot grab a date from before discord existed. Using time in years not DISCORD_EPOCH.
        startNumOfYears = startNumOfYears > maxNumOfYears ? maxNumOfYears : startNumOfYears;
        endNumOfYears = endNumOfYears > maxNumOfYears ? maxNumOfYears : endNumOfYears;

        // If trying to grab a date in backwards order, just rearrange silently.
        if (startNumOfYears < endNumOfYears) {
            [startNumOfYears, endNumOfYears] = [endNumOfYears, startNumOfYears];
        }


        /* Here we are trying to make an artifical discord snowflake.
        * (timestamp_ms - DISCORD_EPOCH) << 22 (timestamp to snowflake)
        * Since we are trying to create a random variation of a snowflake, we need an upper and lower bound on what we can timestamp
        * We take the discord epoch plus the number of years as the smallest timestamp we can go to (Ex. DiscordEpoch + 3years = 2018 at least)
        * Taking the current time - discord epoch gives us the proper time frame to represent todays date, with adding the number of seconds in a 
        * year times the starttime to give us a somewhat accurate start frame. Same with the end time frame.
        * Throwing the start and end time into a random generator between the two values gives us a random timestamp to look for a message
        * Bit shifting this to the right 22 times gives us an artifical snowflake that only has a proper timestamp
        /* For deeper information on snowflakes: https://discord.com/developers/docs/reference#snowflakes */
        let min = interaction.createdTimestamp - (DISCORD_EPOCH + (31556926000 * startNumOfYears));
        let max = interaction.createdTimestamp - (DISCORD_EPOCH + (31556926000 * endNumOfYears)); // Start of today
        let rand = Math.floor(Math.random() * (max - min) + min);

        let randomDate = shift(rand, 22);

        // Log for error related problems
        console.log(`Random memory by user ${interaction.user.username} (${interaction.user.id}) in channel (${interaction.channel.id}) in server ${interaction.guild} (${interaction.guild.id}) with ${interaction.guild.memberCount} users`);
        try {
            if (user === null) {
                const collectionOfMessages = await messages.fetch({ limit: 10, after: randomDate });
                const embed = new MessageEmbed().setTitle("Check this out").setURL(collectionOfMessages.random().url);
                return await interaction.reply({ embeds: [embed] });
            }

            i = 0
            let filteredMessages = new Collection();
            while (filteredMessages.size === 0 && i < 3){
                const collectionOfMessages = await messages.fetch({ limit: 10+(i*30), after: randomDate });
    
                filteredMessages = collectionOfMessages.filter(element => {
                    return element.author.id === user.user.id
                });
                if (filteredMessages.size !== 0){
                    const embed = new MessageEmbed().setTitle("Check this out").setURL(filteredMessages.random().url);
                    return await interaction.reply({ embeds: [embed] });
                }
                i++;
            }
            return await interaction.reply({ content: "Failed to find a message from that user.", ephemeral: true });
        } catch (err) {
            if (err.code == 50001) {
                return await interaction.reply({ content: "I seem to be missing access to view this channel!", ephemeral: true });
            }
            console.error(`No message found for ${interaction.user.tag}.\n`, err);
            await interaction.reply({ content: "Can't find a memory ;(", ephemeral: true });
        }
    },
};
