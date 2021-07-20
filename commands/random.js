require('../ExtendedMessage'); /* for inline reply */
const numOfYears = 3; // furthest we want to go back ~3 years

module.exports = {
    name: 'random',
    description: 'Grab any random message from the past',
    execute(message, args) {
        let messages = message.channel.messages;

        
        let min = message.createdTimestamp - (1420070400000 + (31556926000 * numOfYears)); 
        let today = message.createdTimestamp - 1420070400000; // Start of today
        let rand = Math.floor(Math.random() * (today - min) + min);
        
        let randomDate = shift(rand, 22);
        
        
        messages.fetch({
            limit: 10,
            after: randomDate
        })
        .then(collectionOfMessages => collectionOfMessages
            .random()
            .inlineReply('Check this out!'))
        .catch((err) => {
            console.error('No message found');
            message.inlineReply("Can't find a memory ;(")
        })
    }
}


function shift(number, shift) {
    return number * Math.pow(2, shift);
}