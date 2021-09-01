const { MessageEmbed } = require('discord.js');
const { grabChannel } = require('../utils/grabChannel');
const { shift } = require('../utils/snowflakeUtil');
const DISCORD_EPOCH = 1420070400000;

module.exports = {
    name: 'memory',
    description: 'Grab a memory from the past',
    usage: ['[channel | ID] [date | numOfYears]', '', 'general', 'general 2019-05-05', 'general 3.14159'],
    usage_desc: ['- Showcases a memory from any user', '- Showcases a memory from a year ago', '- Showcases a memory from the general channel a year ago',
    '- Showcases a memory from general around May 5th, 2019', '- Showcases a memory from general ~pi years ago'],
    execute(message, args) {
        let messages = message.channel.messages;
        /* Can specify channel by name or id */
        if (args[0]){
            messages = grabChannel(message, args[0]);
            if (messages === undefined) return; // Don't want to fetch a nonexistent channel
        }

        let numOfYears = 1; // Default behaviour
        /* Can specify when to find a memory from */
        /* Can enter a date or just how long ago */
        if (args[1]) {
            if (!isNaN(args[1])) numOfYears = parseFloat(args[1]);
            else numOfYears = ((message.createdTimestamp - (message.createdTimestamp % 86400000) - new Date(args[1]).getTime())/31535900000).toFixed(8); 
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
        let dateAfter = shift((message.createdTimestamp - (message.createdTimestamp % 86400000) - (DISCORD_EPOCH - 18000000) - (31535900000 * numOfYears)), 22);

        let todayPlusOne = shift(message.createdTimestamp - (message.createdTimestamp % 86400000) + 86400000 - DISCORD_EPOCH, 22);
        if (dateAfter < 0 || dateAfter > todayPlusOne) {
            message.reply({ content: "Invalid date", allowedMentions: { repliedUser: false } });
            return;
        } 

        messages.fetch({
             limit: 10,
             after: dateAfter
            })
        .then(collectionOfMessages => {collectionOfMessages
            const responseMsg = (numOfYears > 1 || numOfYears < 1) ? `Hey checkout this memory from ${numOfYears} years ago!` : 
            "Hey checkout this memory from a year ago!";
            // Cannot inline reply to message in a different channel (discord limitation atm)
            if(args[0]) {
                const embed = new MessageEmbed().setTitle(responseMsg).setURL(collectionOfMessages.random().url);
                message.channel.send({
                    embeds: [embed]
                });
            }
            else 
                collectionOfMessages.random().reply({ content: `${responseMsg}`, allowedMentions: { repliedUser: false } }); 
        })
        .catch((err) => {
            console.error(`No message found for ${message.author.tag}.\n`, err);
            message.reply({ content: "Can't find a memory ;(", allowedMentions: { repliedUser: false } });
        });
    }
}
