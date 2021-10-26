import type Client from '../../main';
import DiscordEvent from '../utils/DiscordEvent';
import { Message } from 'discord.js';

class MessageCreate extends DiscordEvent {
    client: typeof Client;
    constructor(client: typeof Client) {
        super(client, "messageCreate");
        this.client = client;
    }

    async run(message: Message) {
        await this.client.mysql.FOCUser(message.author.id);
    }
}

module.exports = MessageCreate;