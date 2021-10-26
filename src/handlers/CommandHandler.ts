import type Client from "../../main";
import { CommandInteraction, GuildChannel, Permissions, ThreadChannel } from "discord.js";
import Context from "../utils/Context";

class CommandHandler {
    client: typeof Client;

    constructor(client: typeof Client) {
        this.client = client;
    }

    async handle(interaction: CommandInteraction) {
        if(interaction.user.bot || !interaction.inGuild()) return;
        
        const guild = interaction.guild;

        if(!(interaction.channel instanceof GuildChannel) && !(interaction.channel instanceof ThreadChannel)) throw new Error("Salon introuvable.");
        const channelBotPerms = new Permissions(interaction.channel?.permissionsFor(guild.me));

        const command = this.client.commands.findCommand(interaction.commandName);
        if(!command) return;

        if(command.marketingOnly) {
            const marketings: any = await this.client.mysql.db.query(`SELECT * FROM user WHERE marketing='true'`);
            if(!marketings[0].find((m: any) => m.id == interaction.user.id)) return interaction.reply({content: ":x: **|** Cette commande est réservée aux marketings."})
        }
        if(command.adminOnly) {
            const admins: any = await this.client.mysql.db.query(`SELECT * FROM user WHERE admin='true'`);
            if(!admins[0].find((m: any) => m.id == interaction.user.id)) return interaction.reply({content: ":x: **|** Cette commande est réservée aux administrateurs du bot."})
        }
        if(command.ownerOnly && !this.client.config.bot.owners.includes(interaction.user.id)) return interaction.reply({content: ":x: **|** Cette commande est réservée à mes créateurs.", ephemeral: true});
        if(command.userPerms.length > 0 && !command.userPerms.some(p => guild.members.cache.get(interaction.user.id).permissions.has(p))) return interaction.reply({content: `:x: **|** Vous avez besoin d'au moins l'une des permissions suivantes pour cette commande.\n- \`${new Permissions(command.userPerms).toArray().join("`,\n- `")}\``, ephemeral: true})
        if(!guild.me.permissions.has("EMBED_LINKS") || !channelBotPerms.has("EMBED_LINKS")) return interaction.reply({content: ":x: **|** J'ai besoin de la permission `EMBED_LINKS` pour fonctionner.", ephemeral: true});
        if(command.botPerms.length > 0 && !command.botPerms.every(p => guild.me.permissions.has(p) && channelBotPerms.has(p))) return interaction.reply({content: `:x: **|** J'ai besoin des permissions suivantes pour fonctionner correctement.\n- \`${new Permissions(command.botPerms).toArray().join("`,\n- `")}\``, ephemeral: true});
        if(command.disabled && !this.client.config.bot.owners.includes(interaction.user.id)) return interaction.reply({content: ":x: **|** Cette commande a temporairement été désactivée.", ephemeral: true});

        const ctx = new Context(this.client, interaction);

        try {
            await command.run(ctx);
            this.client.logger.info(`La commande ${command.name} a été effectuée par ${ctx.member.user.username} sur le serveur ${ctx.guild.name}`);
        } catch(err) {
            interaction.reply({content: ":x: **|** Oops, une erreur interne est apparue lors de l'execution de la commande. Veuillez ré-essayer plus tard.", ephemeral: true})
            this.client.logger.error(err);
        }
    }
}

export default CommandHandler;