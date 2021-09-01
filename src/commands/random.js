const numOfYears = 4; // Do not go further than the creation of discord (untested)
const DISCORD_EPOCH = 1420070400000;
const { MessageEmbed } = require('discord.js');
const { grabChannel } = require('../utils/grabChannel');
const { shift } = require('../utils/snowflakeUtil');

module.exports = {
    name: 'random',
    description: 'Grab any random message from the past',
    usage: ['[channel | ID]', '', 'general'],
    usage_desc: ['- Showcases a random memory from any user', '- Showcases a random memory', '- Showcases a random memory from general'],
    execute(message, args) {
        let messages = message.channel.messages;
        /* Can specify channel by name or id */
        if (args[0]){
            messages = grabChannel(message, args[0]);
            if (messages === undefined) return; // Don't want to fetch a nonexistent channel
        }

        /* Here we are trying to make an artifical discord snowflake.
         * (timestamp_ms - DISCORD_EPOCH) << 22 (timestamp to snowflake)
         * Since we are trying to create a random variation of a snowflake, we need an upper and lower bound on what we can timestamp
         * We take the discord epoch plus the number of years as the smallest timestamp we can go to (Ex. DiscordEpoch + 3years = 2018 at least)
         * Taking the current time - discord epoch gives us the proper time frame to represent todays date
         * Throwing these two values into a random generator between the two values gives us a random timestamp to look for a message
         * Bit shifting this to the right 22 times gives us an artifical snowflake that only has a proper timestamp
        /* For deeper information on snowflakes: https://discord.com/developers/docs/reference#snowflakes */
        let min = message.createdTimestamp - (DISCORD_EPOCH + (31556926000 * numOfYears)); 
        let today = message.createdTimestamp - DISCORD_EPOCH; // Start of today
        let rand = Math.floor(Math.random() * (today - min) + min);
        
        let randomDate = shift(rand, 22);
        
        
        messages.fetch({
            limit: 10,
            after: randomDate
        })
        .then(collectionOfMessages => { 
            const responseMsg = "Check this out";
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