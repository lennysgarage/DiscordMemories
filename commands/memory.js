require('../utils/ExtendedMessage'); /* for inline reply */
const discordEpochPlusOneYear = 1451627326000;
/* 1420070400000 + 31556926000*/

module.exports = {
    name: 'memory',
    description: 'Grab a memory from the past',
    usage: '[random]',
    execute(message, args) {
        let messages = message.channel.messages;
                
        /* Here we are trying to make an artifical discord snowflake.
         * The timestamp in a snowflake is (snowflake >> 22) + 1420070400000
         * Since we are trying to create a snowflake from a year ago we need to grab the (current time) - discordEpochPlusOneYear
         * Bit shifting this to the right 22 times gives us an artifical snowflake that only has a proper timestamp
        /* For deeper information on snowflakes: https://discord.com/developers/docs/reference#snowflakes */
        let dateAfter = shift((message.createdTimestamp - discordEpochPlusOneYear), 22);
        
        
        let random = false;
        if(args[0] === "random") {
            random = true;
        }

        messages.fetch({
             limit: 10,
             after: dateAfter
            })
        .then(collectionOfMessages => collectionOfMessages
            .filter(m => m.author.id === message.author.id || random)
            .random()
            .inlineReply('Hey checkout this memory from a year ago!'))
        .catch((err) => {
            console.error(`No message found for ${message.author.tag}.\n`, err);
            message.inlineReply("Can't find a memory ;(");
        });
    }
}


function shift(number, shift) {
    return number * Math.pow(2, shift);
}