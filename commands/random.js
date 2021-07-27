require('../utils/ExtendedMessage'); /* for inline reply */
const numOfYears = 3; // furthest we want to go back ~3 years
// Do not go further than the creation of discord (untested)
const { grabChannel } = require('../utils/grabChannel');

module.exports = {
    name: 'random',
    description: 'Grab any random message from the past',
    'usage': '[channel]',
    execute(message, args) {
        let messages = message.channel.messages;
        /* Can specify channel by name or id */
        if (args[0]){
            messages = grabChannel(message, args[0]);
            if (messages === undefined) return;
        }

        /* Here we are trying to make an artifical discord snowflake.
         * The timestamp in a snowflake is (snowflake >> 22) + 1420070400000
         * Since we are trying to create a random variation of a snowflake, we need an upper and lower bound on what we can timestamp
         * We take the discord epoch plus the number of years as the smallest timestamp we can go to (Ex. DiscordEpoch + 3years = 2018 at least)
         * Taking the current time - discord epoch gives us the proper time frame to represent todays date
         * Throwing these two values into a random generator between the two values gives us a random timestamp to look for a message
         * Bit shifting this to the right 22 times gives us an artifical snowflake that only has a proper timestamp
        /* For deeper information on snowflakes: https://discord.com/developers/docs/reference#snowflakes */
        let min = message.createdTimestamp - (1420070400000 + (31556926000 * numOfYears)); 
        let today = message.createdTimestamp - 1420070400000; // Start of today
        let rand = Math.floor(Math.random() * (today - min) + min);
        
        let randomDate = shift(rand, 22);
        
        
        messages.fetch({
            limit: 10,
            after: randomDate
        })
        .then(collectionOfMessages => { 
            const responseMsg = "Check this out"
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


function shift(number, shift) {
    return number * Math.pow(2, shift);
}