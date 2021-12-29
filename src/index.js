const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { AutoPoster } = require('topgg-autoposter');


const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES,
         Intents.FLAGS.GUILD_MESSAGES],
    repliedUser: false 
});

// Comment this out if not posting bot on top.gg
// Comment out when testing
const ap = AutoPoster(process.env.TOPGG_TOKEN, client);

ap.on('posted', (stats) => {
    console.log(`Posted stats to Top.gg! | ${stats.serverCount} servers`);
})

ap.on('error', (err) => {
    console.log('Topgg API error');
})


client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}


/* Simple way to start bot 
client.login(token);
*/


/* If using .env file (RECOMMENDED) */
client.login(process.env.BOT_TOKEN);

