const { Command, CommandoMessage } = require("discord.js-commando");
const { StreamDispatcher } = require('discord.js');
const { BotNotInVoiceChannel, BotNotInVoiceChannelPause, PauseMusic } = require('../../strings.json');


module.exports = class PauseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            group: 'music',
            memberName: 'pause',
            description: 'Met ta musique Youtube en pause.'
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message) {
        /**
         * @type StreamDispatcher
         */
        const dispatcher = message.client.server.dispatcher;
        if (!message.member.voice.channel) {
            return message.say(BotNotInVoiceChannelPause);
        }

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChannel);
        }

        if (dispatcher) {
            dispatcher.pause();
        }

        return message.say(PauseMusic);
    }
}