const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');


const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES,
         Intents.FLAGS.GUILD_MESSAGES],
    repliedUser: false 
});


// chat commmands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// slash commands
client.slashCommands = new Collection();
const slashCommandFiles = fs.readdirSync('./src/slashcommands').filter(file => file.endsWith('.js'));
for (const file of slashCommandFiles) {
    const command = require(`./slashcommands/${file}`);
    client.slashCommands.set(command.data.name, command);
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

// Comment out this section if not posting bot on top.gg
const ap = AutoPoster(process.env.TOPGG_TOKEN, client);

ap.on('posted', (stats) => {
    console.log(`Posted stats to Top.gg! | ${stats.serverCount} servers`);
})

ap.on('error', (err) => {
    console.log('Topgg API error');
})


/* Requires a .env file */
client.login(process.env.BOT_TOKEN);

