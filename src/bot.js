const { Client } = require('discord.js');
const logger = require('./logger');
const path = require('path');
const fs = require('fs');

class Bot extends Client {
    constructor(options) {
        super(options);
        this.options = options;
        this.commands = {};
    }

    initEvents() {
        for (const file of fs.readdirSync(path.join(__dirname, 'events'))) {
            const event = require(`./events/${file}`);
            const eventName = Object.keys(event)[0];
            this.on(eventName, event[eventName].bind(this));
        }
    }

    initCommands() {
        for (const file of fs.readdirSync(path.join(__dirname, 'commands'))) {
            const command = require(`./commands/${file}`);
            const commandName = Object.keys(command)[0];
            Object.assign(this.commands, { [commandName]: command[commandName].bind(this) });
        }
        
        this.on('messageCreate', message => {
            if (message.author.bot) return;
            if (!message.content.startsWith(this.options.prefix)) return;

            const args = message.content.slice(this.options.prefix.length).trim().split(' ');
            const command = args.shift();

            if (Object.keys(this.commands).includes(command)) {
                this.commands[command](message, args);
                logger.info(`${message.author.tag} entered the command '${command}' with args [ ${args.join(', ')} ]`);
            }
        });
    }

    run() {
        this.initEvents();
        this.initCommands();
        this.login(this.options.token);
    }
}

module.exports = Bot;