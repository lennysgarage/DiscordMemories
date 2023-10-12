const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, devGuildId, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./slashcommands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

// rest.put(Routes.applicationCommands(clientId), { body: commands })
rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: commands })
    .then(() => console.log('Successfully registered application commands'))
    .catch(console.error);