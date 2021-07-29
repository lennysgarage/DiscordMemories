require('../utils/ExtendedMessage'); /* for inline reply */
const discordEpochPlusOneYear = 1451627326000;
/* 1420070400000 + 31556926000*/
const { grabChannel } = require('../utils/grabChannel');
const { shift } = require('../utils/snowflakeUtil');

module.exports = {
    name: 'memory',
    description: 'Grab a memory from the past',
    usage: '[channel]',
    execute(message, args) {
        let messages = message.channel.messages;
        /* Can specify channel by name or id */
        if (args[0]){
            messages = grabChannel(message, args[0]);
            if (messages === undefined) return;
        }
                
        /* Here we are trying to make an artifical discord snowflake.
         * The timestamp in a snowflake is (snowflake >> 22) + 1420070400000
         * Since we are trying to create a snowflake from a year ago we need to grab the (current time) - discordEpochPlusOneYear
         * Bit shifting this to the right 22 times gives us an artifical snowflake that only has a proper timestamp
        /* For deeper information on snowflakes: https://discord.com/developers/docs/reference#snowflakes */
        let dateAfter = shift((message.createdTimestamp - discordEpochPlusOneYear), 22);
        

        messages.fetch({
             limit: 10,
             after: dateAfter
            })
        .then(collectionOfMessages => {collectionOfMessages
            const responseMsg = "Hey checkout this memory from a year ago!"
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
