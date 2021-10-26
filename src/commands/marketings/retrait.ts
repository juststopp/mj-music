import Command from '../../utils/Command';
import Context from '../../utils/Context';
import { Channel, MessageActionRow, MessageButton } from 'discord.js';

class Retrait extends Command {
    constructor() {
        super({
            name: "retrait",
            category: "marketings",
            description: "Retirer de l'argent sur PayPal.",
            options: [
                {
                    type: "NUMBER",
                    name: "montant",
                    description: "Montant que vous souhaitez retirer.",
                    required: true
                },
                {
                    type: "STRING",
                    name: "paypal",
                    description: "Lien de vôtre paypal.",
                    required: true
                }
            ],
            marketingOnly: true,
            examples: ["retrait 15 https://paypal.me/monSuperPaypal"]
        })
    }

    async run(ctx: Context) {
        if(ctx.args.getNumber("montant") < ctx.client.config.bot.marketing.minimum) return ctx.reply({content: `:x: **|** Vous ne pouvez pas retirer moins de **${ctx.client.config.bot.marketing.minimum}€**.`, ephemeral: true});
        const userDatas: any = await ctx.client.mysql.db.query(`SELECT * FROM user WHERE id='${ctx.author.id}'`);
        if(ctx.args.getNumber("montant") > userDatas[0][0].argent) return ctx.reply({content: `:x: **|** Vous n'avez pas l'argent requis sur votre profile.`, ephemeral: true});
        await ctx.client.mysql.db.query(`UPDATE user SET argent=${userDatas[0][0].argent - ctx.args.getNumber("montant")}, en_attente=${userDatas[0][0].en_attente + ctx.args.getNumber("montant")} WHERE id='${ctx.author.id}'`);
        const channel: Channel = ctx.guild.channels.cache.get(ctx.client.config.discord.retraitChannel);
        // @ts-ignore
        channel.send({
            content: `**DEMANDE DE RETRAIT**\n\nUtilisateur: \`${ctx.author.tag}\` *(\`${ctx.author.id}\`)*\nMontant du retrait: **${ctx.args.getNumber("montant")}€**\nPayPal: ${ctx.args.getString("paypal")}`,
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`accept-${ctx.author.id}-${ctx.args.getNumber("montant")}`)
                    .setLabel("Accepter le retrait")
                    .setStyle("SUCCESS")
                ).addComponents(
                    new MessageButton()
                    .setCustomId(`reject-${ctx.author.id}-${ctx.args.getNumber("montant")}`)
                    .setLabel("Refuser le retrait")
                    .setStyle("DANGER")
                ).addComponents(
                    new MessageButton()
                    .setCustomId(`delete-${ctx.author.id}-${ctx.args.getNumber("montant")}`)
                    .setEmoji("🗑️")
                    .setStyle("SECONDARY")
                )
            ]
        })
        ctx.reply({content: "Vôtre demande de retrait a correctement été envoyée !"})
    }
}

module.exports = new Retrait();