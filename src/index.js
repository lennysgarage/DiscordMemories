const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { prefix, token } = require('./config.json');
const { AutoPoster } = require('topgg-autoposter');


const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES],
    repliedUser: false 
});

// Comment this out if not posting bot on top.gg
// Comment out when testing
const ap = AutoPoster(process.env.TOPGG_TOKEN, client);

ap.on('posted', () => {
    console.log('Posted stats to Top.gg!');
})

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    client.user.setActivity(`${prefix}help`, { type: 'WATCHING' });
    console.log(`Starting to service ${client.guilds.cache.size} guilds`);
    console.log('Ready!');


    setInterval(async () => {
        // Simplistic get members, includes bot accounts
        await client.guilds.fetch();
        let memberCount = 0;
        for (const guild of client.guilds.cache.values()) {
            memberCount += guild.memberCount;
        }
            
        console.log(`Currently servicing ${client.guilds.cache.size} guilds & ${memberCount} users`);
    }, 3600000);
});


client.on('guildCreate', guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on('guildDelete', guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id}). This guild had ${guild.memberCount} members!`);
});


client.on('messageCreate', async message => {
    /* Interact via prefix or mention */
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
});

/* Default way to start bot 
client.login(token);
*/


/* If using .env file */
client.login(process.env.BOT_TOKEN);

