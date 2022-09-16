const maxNumOfYears = 7; // Do not go further than the creation of discord (untested)
const DISCORD_EPOCH = 1420070400000;
const { MessageEmbed } = require('discord.js');
const { grabChannel } = require('../utils/grabChannel');
const { shift } = require('../utils/snowflakeUtil');

module.exports = {
    name: 'random',
    description: 'Grab any random message from the past',
    usage: ['[channel | ID]', '', 'general', 'general Jan 1 2021 May 5 2022'],
    usage_desc: ['- Showcases a random memory from any user', '- Showcases a random memory', '- Showcases a random memory from general', '- Showcases a random memory from general between Jan 1st, 2021 and May 5th, 2022'],
    async execute(message, args) {
        let messages = message.channel.messages;
        /* Can specify channel by name or id */
        if (args[0]){
            messages = grabChannel(message, args[0]);
            if (messages === undefined) return; // Don't want to fetch a nonexistent channel
        }
        
        let startNumOfYears = 0; // Default behaviour
        let endNumOfYears = maxNumOfYears;
        /* Can specify when to find a memory from */
        /* Can enter a date or just how long ago */
        if (args[1]) {
            if (!isNaN(args[1])) startNumOfYears = parseFloat(args[1]).toFixed(8);
            else startNumOfYears = ((message.createdTimestamp - (message.createdTimestamp % 86400000) - new Date(args[1]).getTime()) / 31535900000).toFixed(8);
            // 8 Digits allow for better accuracy when dealing with miliseconds
            // We grab the current time subtracting the number of miliseconds currently in the day to get the earliest moment
            // We take this time divided by roughly how many miliseconds in a year
        }
        if (args[2]) {
            if (!isNaN(args[2])) endNumOfYears = parseFloat(args[2]).toFixed(8);
            else endNumOfYears = ((message.createdTimestamp - (message.createdTimestamp % 86400000) - new Date(args[2]).getTime()) / 31535900000).toFixed(8);
            // 8 Digits allow for better accuracy when dealing with miliseconds
            // We grab the current time subtracting the number of miliseconds currently in the day to get the earliest moment
            // We take this time divided by roughly how many miliseconds in a year
        }


        if (startNumOfYears < 0 || endNumOfYears < 0 || isNaN(startNumOfYears) || isNaN(endNumOfYears)) {
            return await message.reply({ content: "Invalid date", ephemeral: true})
        }

        // Cannot grab a date from before discord existed. Using time in years not DISCORD_EPOCH.
        startNumOfYears = startNumOfYears > maxNumOfYears ? maxNumOfYears : startNumOfYears;
        endNumOfYears = endNumOfYears > maxNumOfYears ? maxNumOfYears : endNumOfYears;

        // If trying to grab a date in backwards order, just rearrange silently.
        if (startNumOfYears < endNumOfYears) {
            startNumOfYears, endNumOfYears = endNumOfYears, startNumOfYears;
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
        let min = message.createdTimestamp - (DISCORD_EPOCH + (31556926000 * startNumOfYears));
        let max = message.createdTimestamp - (DISCORD_EPOCH + (31556926000 * endNumOfYears)); // Start of today
        let rand = Math.floor(Math.random() * (max - min) + min);

        
        let randomDate = shift(rand, 22);
        
        try {
            const collectionOfMessages = await messages.fetch({ limit: 10, after: randomDate });
            const responseMsg = "Check this out";
            if (args[0]) {
                const embed = new MessageEmbed().setTitle(responseMsg).setURL(collectionOfMessages.random().url);
                await message.channel.send({ embeds: [embed] });
            } else {
                await collectionOfMessages.random().reply({ content: `${responseMsg}`, allowedMentions: { repliedUser: false } });
            }
        } catch(err) {
            if (err.code == 50001) {
                return await message.reply({ content: "I seem to be missing access to view this channel!", allowedMentions: { repliedUser: false } });
            }
            console.error(`No message found for ${message.author.tag}.\n`, err);
            await message.reply({ content: "Can't find a memory ;(", allowedMentions: { repliedUser: false } });
        }
        // Log for error related problems
        console.log(`Random memory by user ${message.author.username} (${message.author.id}) in channel (${message.channel.id}) in server ${message.guild} (${message.guild.id}) with ${message.guild.memberCount} users`);
    }
}