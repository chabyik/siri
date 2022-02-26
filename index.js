const { Intents } = require('discord.js');
const { token, prefix } = require('./config.json');
const Bot = require('./src/bot');

const bot = new Bot({
    token,
    prefix,
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
    ],
});

bot.run();