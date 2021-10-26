import type { Interaction } from "discord.js";
import type Client from "../../main";
import CommandHandler from "../handlers/CommandHandler";
import DiscordEvent from "../utils/DiscordEvent";
import ButtonHandler from "../handlers/ButtonHandler";

class InteractionCreate extends DiscordEvent {
    commands: CommandHandler;
    buttons: ButtonHandler;
    constructor(client: typeof Client) {
        super(client, "interactionCreate");
        this._client = client;
        this.commands = new CommandHandler(this._client);
        this.buttons = new ButtonHandler(this._client);
    }

    async run(interaction: Interaction) {
        if(interaction.isCommand()) await this.commands.handle(interaction);
        if(interaction.isButton()) await this.buttons.handle(interaction);
    }
}

module.exports = InteractionCreate;