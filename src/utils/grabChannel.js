
module.exports = {
    grabChannel(message, channelNameOrID) {
        const msgChannel = message.guild.channels.cache.find(channel => 
            channel.name === channelNameOrID || channel.id === channelNameOrID);
        if ( msgChannel !== undefined ){
            return msgChannel.messages;
        } else {
            message.inlineReply("Invalid channel");
            return;
        }
    }
}