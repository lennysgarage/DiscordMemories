
module.exports = {
    grabChannel(message, channelNameOrID) {
        const msgChannel = message.guild.channels.cache.find(channel => 
            channel.name === channelNameOrID || channel.id === channelNameOrID);
        if ( msgChannel !== undefined && msgChannel.isText() ){
            return msgChannel.messages;
        } else {
            message.reply({ content: "Channel does not exist", allowedMentions: { repliedUser: false } });
            return;
        }
    }
}