require('../ExtendedMessage');

module.exports = {
    name: 'random',
    description: 'Grab any random message from the past',
    execute(message, args) {
        let messages = message.channel.messages;

        let min = message.createdTimestamp - 1514741178000; // furthest we want to go back ~3 years
        let today = message.createdTimestamp - 1420070400000 - 86400000; // Yesterday
        let rand = Math.floor(Math.random() * (today - min) + min);
        
        let randomDate = shift(rand, 22);
        
        
        messages.fetch({
            limit: 10,
            after: randomDate
        })
        .then(collectionOfMessages => collectionOfMessages
            .random()
            .inlineReply('Check this out!'))
        .catch(() => {
            console.error;
            message.inlineReply("Can't find a memory ;(")
        })
    }
}



function shift(number, shift) {
    return number * Math.pow(2, shift);
}