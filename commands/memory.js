require('../ExtendedMessage'); /* for inline reply */
const discordEpochPlusOneYear = 1451627326000;

module.exports = {
    name: 'memory',
    description: 'Grab a memory from the past',
    execute(message, args) {
        let messages = message.channel.messages;
        
        let dateBefore = shift((message.createdTimestamp - discordEpochPlusOneYear), 22);
        
        let dateAfter = shift((message.createdTimestamp - discordEpochPlusOneYear - 86400000), 22);

        
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
        .catch(() => {
            console.error;
            message.inlineReply("Can't find a memory ;(");
        });
    }
}


function shift(number, shift) {
    return number * Math.pow(2, shift);
}