<p align="center"><a href="https://nodei.co/npm/discord.ts/"><img src="https://nodei.co/npm/discord.ts.png"></a></p>
<p align="center"><img src="https://img.shields.io/npm/v/discord.ts"> <img src="https://img.shields.io/npm/dm/discord.ts?label=downloads"> <img src="https://img.shields.io/npm/l/discord.ts"> <img src="https://img.shields.io/github/repo-size/meister03/discord.ts">  <a href="https://discord.gg/YTdNBHh"><img src="https://discordapp.com/api/guilds/697129454761410600/widget.png" alt="Discord server"/></a></p>


# Discord.ts
Powerful Discord API library based on Discordeno components, allowing vertical and horizontal scaling.

## Features
* Standalone Rest Proxy - [Features](https://github.com/discordeno/discordeno#rest)
* Standalone Gateway Proxy - [Features](https://github.com/discordeno/discordeno#gateway)
* [On Work] Cache Proxy
* [On Work] Structures
* Support of Node.js & Deno (experimental) runtime

<!-- 
### Featured by Discord Creators

[Private Community for Verified Bot Developers. ](https://discord.gg/R3hPevRtUV)
[Meet big bot and small bot developers and have a nice exchange...](https://discord.gg/R3hPevRtUV) 

<p>
<a href="https://discord.gg/R3hPevRtUV">
<img src="https://media.discordapp.net/attachments/980770619161448489/982938274677018624/banner.png?width=320&height=80">
</a>
</p> 
-->

### See below for the Guide

**If you need help, feel free to join our <a href="https://discord.gg/YTdNBHh">Discord server</a>. ☺**

## Seperate Gateway/Rest
The seperate gateway/rest setup requires you to have two processes. One, which will have the standalone gateway/rest and the other your bot, where the Discord Payloads will be transmitted to.

It is also possible creating two seperate processes for the standalone gateway & rest for the sake of simplicity the example below will show both together.


File: Server.js
* Starts the Rest Proxy, which will forward the requests from your Bot to Discord and respond with the result back
* Starts the Gateway Proxy, which will connect to the Discord Gateway and send the Discord Gateway Packets to the connected Machines.

```js
import { GatewayServerProvider, RestServerProvider , Server} from 'discord.ts'; // change to lib import
import { GatewayIntents } from 'discordeno/types';
import config from './config.json'
const server = new Server({
    token: config.token,
    providers: {
        rest: new RestServerProvider({
            secretKey: '111',
            customUrl: 'http://localhost:3000'
        }),
        gateway: new GatewayServerProvider({
            secretKey: '111',
            customUrl: 'http://localhost:3001',
            intents: GatewayIntents.GuildMessages | GatewayIntents.MessageContent,
            // tcpOptions: Opt-into tls & certificate mode, when you want to use it on a public machine
            // -> https://github.com/meister03/discord-cross-hosting#42-certificate-mode
            totalMachines: 1,
        })
    }
})

server.gateway?.start()
```

File: Bot.js
* Connects the GatewayProvider to the TCP Server on the Server.js file and receives the Packets from it
* Rest requests are forwarded to the rest proxy 
* Based on the amount of totalMachines provided in the Server.js file, that amount of Bot.js file has to be started. (Will be done soon by discord-hybrid-sharding)

```js
import { RestClientProvider, createBot, GatewayClientProvider } from 'discord.ts';
import config from './config.json'

const bot = createBot({
    token: config.token,
    events: {
        messageCreate: (bot, message)=>{
            if(message.isFromBot) return;
            // do your stuff
        }
    }
},
    {
        rest: new RestClientProvider({
            secretKey: '111',
            customUrl: 'http://localhost:3000',
        }),
        gateway: new GatewayClientProvider({
            secretKey: '111',
            customUrl: 'http://localhost:3001',
            // tcpOptions: Opt-into tls & certificate mode, when you want to use it on a public machine
            // -> https://github.com/meister03/discord-cross-hosting#42-certificate-mode
        })
    }
)
bot.gateway?.start()
```

## Status:
* A Cache implementation is currently on work
* The internal functions can be overwritten inorder to create an other implementation


# Bugs, glitches and issues

If you encounter any problems feel free to open an issue in our <a href="https://github.com/meister03/discord.ts/issues">GitHub repository or join the Discord server.</a>
