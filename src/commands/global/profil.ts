import Command from '../../utils/Command';
import Context from '../../utils/Context';
import { MessageEmbed } from 'discord.js';

class Profile extends Command {
    constructor() {
        super({
            name: "profile",
            category: "global",
            description: "Voir son profile ou celui d'un utilisateur.",
            options: [
                {
                    type: "USER",
                    name: "utilisateur",
                    description: "Utilisateur du profile que vous souhaitez regarder. (Bot Admins only)",
                    required: false,
                },
            ],
            marketingOnly: true,
            examples: ["profile @JustStop__"]
        })
    }

    async run(ctx: Context) {
        const profileToSee = ctx.author.id.includes(ctx.client.config.bot.admins) ? ctx.args.getUser("utilisateur") ?? ctx.author : ctx.author
        const userDatas: any = await ctx.client.mysql.db.query(`SELECT * FROM user WHERE id='${profileToSee.id}'`);
        const userInvites: any = await ctx.client.mysql.db.query(`SELECT SUM(invites) FROM invites WHERE user_id='${profileToSee.id}'`);
        ctx.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(`Profile de ${profileToSee.username}`)
                .setColor('#2f3136')
                .addField("Invitations totales", `\`${userInvites[0][0]['SUM(invites)'] ?? 0}\` invitations`,true)
                .addField("Argent", `\`${userDatas[0][0].argent}\`€`, true)
                .addField("Argent en retrait", `\`${userDatas[0][0].en_attente}\`€`, true)
            ]
        })
    }
}

module.exports = new Profile();