const { prefix } = require('../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        /* Interact via prefix or mention */
        const client = message.client;
        if (!message.author.bot && !message.mentions.everyone 
            && (message.mentions.has(client.user) || message.content.startsWith(prefix))) {
            /* Command from prefix */
            let args;
            if (message.content.startsWith(prefix)) 
                args = message.content.slice(prefix.length).trim().split(/ +/);
            else /* Command from mention */
                args = message.content.slice(client.user.id.length +4).trim().split(/ +/); 
                // +4 accounts for <@!>

            // Don't want to fire off when just prefix
            if (!message.mentions.has(client.user) && args[0] == '') return; 
            const commandName = args.shift().toLowerCase() || 'help'; // Default to help menu

            if (!client.commands.has(commandName)) return; // Check if cmd exists
            const command = client.commands.get(commandName);

            /* Execute the command */
            try { 
                command.execute(message, args);
            } catch(error) {
                console.error(error);
                await message.reply({ content: 'there was an error trying to bring up the help menu!', allowedMentions: { repliedUser: true } });    
            }
        }
    },
};