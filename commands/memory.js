require('../utils/ExtendedMessage'); /* for inline reply */
const { grabChannel } = require('../utils/grabChannel');
const { shift } = require('../utils/snowflakeUtil');

module.exports = {
    name: 'memory',
    description: 'Grab a memory from the past',
    usage: '[channel|ID] [date|numOfYears]',
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
            else numOfYears = ((message.createdTimestamp - (message.createdTimestamp % 86400000) - new Date(args[1]).getTime())/31536000000).toFixed(8); 
            // 6 Digits allow for better accuracy when dealing with miliseconds
            // We grab the current time subtracting the number of miliseconds currently in the day to get the earliest moment
            // We take this time divided by how many miliseconds in a year
        }

                
        /* Here we are trying to make an artifical discord snowflake.
         * The timestamp in a snowflake is (snowflake >> 22) + 1420070400000
         * Since we are trying to create a snowflake from a year ago we need to grab the (time at the start of message's day) - discordEpoch + # of years
         * Since unix time uses UTC, I've configured the miliseconds in a year calculation to compensate roughly for the 4 hour difference between UTC and EST
         * If you want to just use UTC change (31530960000 * numOfYears) to (31536000000 * numOfYears)
         * Bit shifting this to the right 22 times gives us an artifical snowflake that only has a proper timestamp
         * (timestamp_ms - DISCORD_EPOCH) << 22 (timestamp to snowflake)
        /* For deeper information on snowflakes: https://discord.com/developers/docs/reference#snowflakes */
        let dateAfter = shift((message.createdTimestamp - (message.createdTimestamp % 86400000) - 1420070400000 - (31530960000 * numOfYears)), 22);
        
        messages.fetch({
             limit: 10,
             after: dateAfter
            })
        .then(collectionOfMessages => {collectionOfMessages
            const responseMsg = numOfYears > 1 ? `Hey checkout this memory from ${numOfYears} years ago!` : 
            "Hey checkout this memory from a year ago!";
            // Cannot inline reply to message in a different channel (discord limitation atm)
            if(args[0]) {
                message.channel.send({
                    embed: {
                        title: responseMsg,
                        url: collectionOfMessages.random().url
                    }
                });
            }
            else 
                collectionOfMessages.random().inlineReply(`${responseMsg}`); 
        })
        .catch((err) => {
            console.error(`No message found for ${message.author.tag}.\n`, err);
            message.inlineReply("Can't find a memory ;(");
        });
    }
}
