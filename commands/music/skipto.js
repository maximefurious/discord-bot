const { Command, CommandoMessage } = require("discord.js-commando");
const { BotNotInVoiceChannel, BotNotInVoiceChannelPause } = require('../../strings.json');
const ytdl = require('ytdl-core');

module.exports = class SkiptoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skipto',
            group: 'music',
            memberName: 'skipto',
            description: 'Permet de sauter à une certaine position dans la file d\'attente un titre.',
            args: [{
                key: "index",
                prompt: 'A quelle position de la fil veux-tu te rendre ?',
                type: 'integer'
            }]
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message, { index }) {
        const voiceChannel = message.member.voice.channel;
        const server = message.client.server;

        if (!voiceChannel) {
            return message.say(BotNotInVoiceChannelPause);
        }

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChannel);
        }

        index--;

        if (!server.queue[index]) {
            server.currentVideo = { url: "", title: "Rien pour le moment ! " };
            return message.say("Il n'y a rien dans la file d'attente à cette position !");
        }


        server.currentVideo = server.queue[index];
        server.dispatcher = server.connection.play(await ytdl(server.currentVideo.url, { filter: 'audioonly' }));
        server.queue.splice(index, 1);

        return message.say(":fast_forward: Ignoré :thumbsup:");
    }
}