# DiscordMemories
<img src="https://cdn.discordapp.com/avatars/867469054931501078/bf64ca402609e37b2db3f9395a652abd.webp" width=180 height=180>

### Introduction
Memories is a Discord bot to easily look at past messages in your Discord server.
Similar functionality to Snapchat's Memories feature!

##### Default command prefix: == 
###### Commands can be called via the prefix, slash commands or even by mentioning the bot and the command. 
---
### Functionality


#### Memory Command
`memory [channel|ID] [date|numOfYears]`:
- Showcases a memory from any user.
##### Examples:
* `memory` 
    Showcases a memory from any user a year ago.
* `memory general` 
    Showcases a memory from the channel `general` around one year ago.
* `memory general 2019-05-05` 
    Showcases a memory from the channel `general` around May 5th, 2019.
* `memory general 3.14159` 
    Showcases a memory from the channel `general` ~pi years ago.
    
    
#### Random Command
`random [channel|ID] [user] [startDate|minNumOfYears] [endDate|maxNumOfYears]`:
- Showcases a random memory from any user.
##### Examples:
* `random` 
    Showcases a random memory from as far back as the channel's age.   
* `random general` 
    Showcases a random memory from the channel `general` as far back as the creation of the channel.
* `random general lennysgarage`
    Showcases a random memory from user `lennysgarage` in the channel `general` as far back as the creation of the channel. 
* `random general Jan 1 2021 May 5 2022`
    Showcases a random memory from the channel `general` between Jan 1st, 2021 and May 5th, 2022.
* `random general lennysgarage Jan 1 2021 May 5 2022`
    Showcases a random memory from user `lennysgarage` in the channel `general` between Jan 1st, 2021 and May 5th, 2022.
        
#### Help Command
`help [command]`:
- Displays information on all commands.
##### Examples:
* `help`
    Sends a direct message displaying all commands available.
* `help memory` 
    Returns information on the memory command.
    
#### Info Command
`info`:
- Displays information on the bot.
##### Examples:
* `info`
   * Showcases bot's current info, including version and prefix.
   * Showcases bot's internal information such as latency, uptime, version, and ram.
   * Showcases analytics of bot, including how many servers and users.
   * Showcases other information pertaining to the running of the bot.

#### Invite Command
`invite`:
- Displays invite link for bot.
##### Examples:
* `invite`
    * Showcases the bot's invitation link to add to your own server!

---
###  Add Memories to your server [here](https://discord.com/oauth2/authorize?client_id=867469054931501078&permissions=68608&scope=bot%20applications.commands)
---
**Requirements** 
* node ^16.14.*
* Discord.js v13
