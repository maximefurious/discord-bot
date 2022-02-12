const { VoiceConnection } = require('@discordjs/voice');
const { Command, CommandoMessage } = require("discord.js-commando");
const ytdl = require('ytdl-core');
const { BotNotInVoiceChannelPause, BotInPlay, AddToQueue } = require('../../strings.json');
const { key } = require('../../config.json');
const ytsr = require('youtube-search');


module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['p'],
            group: 'music',
            memberName: 'play',
            description: 'Jouez votre musique depuis Youtube.',
            args: [{
                key: 'query',
                prompt: 'Quelle musique veux tu lire !',
                type: 'string'
            }]
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message, { query }) {
        if (!message.member.voice.channel) {
            return message.say(BotNotInVoiceChannelPause);
        }



        const server = message.client.server;
        await message.member.voice.channel.join().then((connection) => {

            ytsr(query, { key: key, maxResults: 1, type: 'video' }).then((results) => {
                if (results.results[0]) {
                    const foundVideo = { url: results.results[0].link, title: results.results[0].title };

                    if (server.currentVideo.url != "") {
                        server.queue.push(foundVideo);
                        return message.say("`" + foundVideo.title + "` " + AddToQueue);
                    }
                    server.currentVideo = foundVideo;
                    this.runVideo(message, connection);
                }
            });
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {VoiceConnection} connection 
     * @param {*} video 
     */
    async runVideo(message, connection, videoUrl) {
        const server = message.client.server;
        const dispatcher = connection.play(await ytdl(server.currentVideo.url, { filter: 'audioonly' }));

        server.queue.shift();
        server.dispatcher = dispatcher;
        server.connection = connection;

        dispatcher.on('finish', () => {
            if (server.queue[0]) {
                server.currentVideo = server.queue[0];
                return this.runVideo(message, connection, server.currentVideo.url);
            }
        });

        return message.say(BotInPlay + "`" + server.currentVideo.title + "`");
    }
}