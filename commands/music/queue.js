const { MessageEmbed } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");
const { BotNotInVoiceChannel, BotPageNotFound } = require('../../strings.json');

module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            group: 'music',
            memberName: 'queue',
            description: 'Affiche la file d\'attente. Pour afficher différentes pages, tape la commande avec le numéro de page spécifié après (queue 2).',
            args: [{
                key: 'page',
                prompt: 'Quelle page veux-tu afficher ?',
                default: 1,
                type: 'integer'
            }]
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {number} page 
     */
    async run(message, { page }) {
        const server = message.client.server;

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChannel);
        }

        const numbrOfItem = 10;
        const startingItem = (page - 1) * numbrOfItem;
        const queueLength = server.queue.length;

        var itemPerPage = startingItem + numbrOfItem;
        var totalPages = 1;

        var embed = new MessageEmbed()
            .setTitle(`File d'attente pour ${message.author.username}`)
            .setColor("BLUE")
            .addField("En train de jouer : ", `[${server.currentVideo.title}]` + `(${server.currentVideo.url})`);

        if (queueLength > 0) {
            var value = "";

            if (queueLength > numbrOfItem) {
                totalPages = Math.ceil(queueLength / 10);
            }

            if (page < 0 || (page) > totalPages) {
                return message.say(BotPageNotFound);
            }

            if ((queueLength - startingItem) < 10) {
                itemPerPage = (queueLength - startingItem) + startingItem;
            }

            for (let i = startingItem; i < itemPerPage; i++) {
                const video = server.queue[i];
                value += "`" + (i + 1) + ".` [" + video.title + "](" + video.url + ')\n';
            }
            embed.addField("A venir : ", value);
        }

        embed.setFooter(`Page : ${page}/${totalPages}`);

        return message.say(embed);
    }
}