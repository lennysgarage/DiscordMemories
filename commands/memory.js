require('../utils/ExtendedMessage'); /* for inline reply */
const { grabChannel } = require('../utils/grabChannel');
const { shift } = require('../utils/snowflakeUtil');

module.exports = {
    name: 'memory',
    description: 'Grab a memory from the past',
    usage: '[channel] [date|numOfYears]',
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
            else numOfYears = ((new Date().getTime() - new Date(args[1]).getTime())/31556926000).toFixed(2);
            // We grab the current time subtracting the specified time divided by how many miliseconds in a year
        }
                
        /* Here we are trying to make an artifical discord snowflake.
         * The timestamp in a snowflake is (snowflake >> 22) + 1420070400000
         * Since we are trying to create a snowflake from a year ago we need to grab the (current time) - discordEpoch + # of years
         * Bit shifting this to the right 22 times gives us an artifical snowflake that only has a proper timestamp
        /* For deeper information on snowflakes: https://discord.com/developers/docs/reference#snowflakes */
        let dateAfter = shift((message.createdTimestamp - 1420070400000 - (31556926000 * numOfYears)), 22);
        

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
